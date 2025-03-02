import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  setAspectRatios,
  setPost,
  setPostIndex,
} from "@/redux/slice/postSlice";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CropPortraitIcon from "@mui/icons-material/CropPortrait";
import CropLandscapeIcon from "@mui/icons-material/CropLandscape";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/helperFuntions/getCroppedImage";
import { RootState } from "@/redux/store/store";

const SelectAspectRatioAndUplaod = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [aspectRatio, setAspectRatio] = useState(1 / 1);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [fileType, setFileType] = useState("");
  const { postType } = useSelector((state: RootState) => state.post);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleUplaodClick = () => {
    if (!aspectRatio) {
      toast.error("Select a aspect ratio.");
      return;
    }

    if (uploadInputRef.current) {
      uploadInputRef.current.click();
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
        dispatch(setPost([post]));
        dispatch(setPostIndex(0));
        dispatch(setAspectRatios(aspectRatio));
        setImage("");
        setFileType("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        onOpenChange();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (image) {
      setImage("");
      setFileType("");
    }
    const files = e.target.files;
    if (files && files.length === 1) {
      const file = files[0];
      const fileType = postType === 'reel' ? "reel" : file.type.startsWith("video") ? "video" : "image";

      if (fileType == "video" && postType == "image") {
        toast.error("Upload Image");
        return;
      } else if (fileType === "image" && postType === "video") {
        toast.error("Upload Video");
        return;
      } else if (fileType === 'image' && postType === 'reel') {
        toast.error("Upload Video");
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        toast.error("The file size cannot exceed 100 MB!");
        return;
      }

      if (fileType === "video" || fileType === 'reel') {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          const durationInMinutes = video.duration / 60;

          if (fileType === 'video' && durationInMinutes > 5) {
            toast.error("The video duration cannot exceed 5 minutes!");
            return;
          } else if (fileType === 'reel' && durationInMinutes > 1) {
            toast.error("The reel duration cannot exceed 1 minutes!");
            return;
          }

          const post = {
            url: URL.createObjectURL(file),
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
          dispatch(setPost([post]));
          dispatch(setPostIndex(0));
          dispatch(setAspectRatios('original'));
        };
      } else {
        const fileURL = URL.createObjectURL(file);
        setImage(fileURL);
        setFileType(fileType);
        onOpen();
      }
    } else {
      toast.error("Please choose a single file to upload.");
    }
  };

  return (
    <div className="w-52 flex flex-col gap-3">
      {postType === "image" && (
        <>
          <h1>Select Aspect Ratio</h1>
          <RadioGroup defaultValue="1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                onClick={() => setAspectRatio(1 / 1)}
                value="1"
                id="r1"
              />
              <div className="flex items-center">
                <Label htmlFor="r1" className="mr-1">
                  1 : 1
                </Label>
                <span className="text-gray-500">(Square)</span>
                <CropSquareIcon />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                onClick={() => setAspectRatio(4 / 5)}
                value="4"
                id="r2"
              />
              <div className="flex items-center">
                <Label htmlFor="r2" className="mr-1">
                  4 : 5
                </Label>
                <span className="text-gray-500">(Portrait)</span>
                <CropPortraitIcon />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                onClick={() => setAspectRatio(16 / 9)}
                value="16"
                id="r3"
              />
              <div className="flex items-center">
                <Label htmlFor="r3" className="mr-1">
                  16 : 9
                </Label>
                <span className="text-gray-500">(Landscape)</span>
                <CropLandscapeIcon />
              </div>
            </div>
          </RadioGroup>
        </>
      )}

      <button
        onClick={handleUplaodClick}
        className={`bg-transparent transition-colors p-2 border text-sm rounded-md dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white`}
      >
        Upload {postType === 'image' || postType === 'video' ? "Post" : postType === 'reel' ? 'Reel' : "Live"}
      </button>
      <input
        onChange={handleInputChange}
        ref={uploadInputRef}
        type="file"
        accept={`${postType === "image" ? "image/*" : "video/*"}`}
        hidden
      />
      {image && (
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
    </div>
  );
};

export default SelectAspectRatioAndUplaod;
