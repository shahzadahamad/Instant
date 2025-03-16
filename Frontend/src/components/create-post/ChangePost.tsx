import { RootState } from "@/redux/store/store";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  pushPost,
  removePost,
  setAspectRatios,
  setPost,
  setPostIndex,
} from "@/redux/slice/postSlice";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/helperFuntions/getCroppedImage";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ChangePost = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { post, postIndex, isStory } = useSelector((state: RootState) => state.post);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [fileType, setFileType] = useState("");
  const { aspectRatio } = useSelector((state: RootState) => state.post);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCancel = (index: number) => {
    dispatch(removePost(index));
    toast.success("Post Removed");
  };

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCroppedImage = async () => {
    try {
      if (image && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        const post = {
          url: croppedImage,
          type: fileType,
          filterClass: "",
          customFilter: [
            { label: "Contrast", value: 100, field: "contrast" },
            { label: "Brightness", value: 100, field: "brightness" },
            { label: "Saturation", value: 100, field: "saturate" },
            { label: "Sepia", value: 0, field: "sepia" },
            { label: "Gray Scale", value: 0, field: "gray" },
          ],
          tagUsers: [],
        };
        dispatch(pushPost(post));
        dispatch(setPostIndex(0));
        dispatch(setAspectRatios(aspectRatio));
        setImage("");
        setFileType("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        onOpenChange();
        toast.success("Post Added");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      setImage("");
      setFileType("");
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
    onOpenChange();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (image) {
      setImage("");
      setFileType("");
    }

    if (post.length >= 10) {
      toast.error("Only up to 10 files are allowed");
      return;
    }

    const files = e.target.files;
    if (files && files.length === 1) {
      const file = files[0];
      if (file.size > 100 * 1024 * 1024) {
        toast.error("The file size cannot exceed 100 MB!");
        return;
      }

      const fileType = file.type.startsWith("video") ? "video" : "image";

      if (fileType === "video") {
        toast.error("Only a single video can be uploaded at a time.");
        return;
      }

      const fileURL = URL.createObjectURL(file);
      setImage(fileURL);
      setFileType(fileType);
      onOpen();
    } else {
      toast.error("Please choose a single file to upload.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-full w-full">
      <div
        className={`flex h-full w-full items-center ${post && post.length > 0 && post[postIndex].type === "video" || post[postIndex].type === 'reel' || (post[postIndex].type === 'story' && !isStory)
          ? "justify-center"
          : "justify-start"
          } gap-2 overflow-x-scroll scrollbar-hidden`}
      >
        {post && post.length > 0 ? (
          <>
            <DragDropContext
              onDragEnd={(result) => {
                if (!result.destination) return;
                const newPosts = Array.from(post);
                const [movedPost] = newPosts.splice(result.source.index, 1);
                newPosts.splice(result.destination.index, 0, movedPost);
                dispatch(setPost(newPosts));
              }}
            >
              <Droppable droppableId="post" direction="horizontal">
                {(provided) => (
                  <div
                    className="flex gap-2 overflow-auto scrollbar-hidden"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {post.map((postItem, index) =>
                      postItem.type === "image" || (postItem.type === 'story' && isStory) ? (
                        <Draggable
                          key={index}
                          draggableId={`post-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="relative w-44 h-44 flex-shrink-0"
                            >
                              <div className="relative w-44 h-44">
                                <img
                                  className="w-full h-full object-cover rounded"
                                  src={postItem.url}
                                  alt=""
                                />
                                <FontAwesomeIcon
                                  onClick={() => handleCancel(index)}
                                  icon={faCircleXmark}
                                  className="absolute rounded-full w-5 hover:opacity-70 transition-colors h-5 top-2 right-2 cursor-pointer"
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ) : postItem.type === "video" || postItem.type === 'reel' || (postItem.type === 'story' && !isStory) ? (
                        <div
                          key={index}
                          className="relative w-72 h-72 border rounded-md"
                        >
                          <video
                            className="w-full h-full object-contain rounded"
                            src={postItem.url}
                          />
                          <FontAwesomeIcon
                            onClick={() => handleCancel(index)}
                            icon={faCircleXmark}
                            className="absolute rounded-full w-5 hover:opacity-70 transition-colors h-5 top-2 right-2 cursor-pointer"
                          />
                        </div>
                      ) : null
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <input
              onChange={handleInputChange}
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              hidden
            />
            {image && aspectRatio && (
              <Modal
                isOpen={isOpen}
                size="full"
                onOpenChange={() => handleModalChange(isOpen)}
                className="flex items-center justify-center"
              >
                <ModalContent>
                  <ModalHeader>
                    <div className="w-full flex justify-between items-center">
                      <h1 className="text-lg font-semibold">Crop Image</h1>
                    </div>
                  </ModalHeader>
                  <ModalBody className="w-full h-[100vh] flex items-center justify-center border-t relative">
                    <div className="relative w-full h-full bg-gray-500 max-w-[100vh] max-h-[80vh] rounded-md overflow-hidden">
                      <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        objectFit="contain"
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                      <h1
                        onClick={handleCroppedImage}
                        className="absolute right-4 bottom-4 text-blue-600 cursor-pointer font-bold"
                      >
                        Next
                      </h1>
                    </div>
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
            {post[postIndex].type !== "video" && post[postIndex].type !== 'reel' && post[postIndex].type !== 'story' && (
              <Button
                variant="outline"
                className="absolute top-4 right-4 rounded-md bg-transparent border"
                onClick={() =>
                  uploadInputRef.current && uploadInputRef.current.click()
                }
              >
                Add Post
              </Button>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <h1 className="text-center">Upload a Post</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePost;
