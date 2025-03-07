import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { adminApiClient } from "@/apis/apiClient";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { useRef, useState } from "react";
import { AxiosError } from "axios";
import { createMusicSchema } from "@/validations/authValidations";

const MusicAction: React.FC<{
  id: string;
  isListed: boolean;
  title: string;
  fetchMusic: (page: number, limit: number) => void;
  page: number;
  image: string;
}> = ({ id, isListed, title, fetchMusic, page, image }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [image1, setImage1] = useState(image);
  const [titleInput, setTitleInput] = useState(title);

  const handleAction = async (
    e: React.MouseEvent<HTMLDivElement>,
    musicId: string,
    isListed: boolean,
    username: string
  ) => {
    e.preventDefault();
    const status = isListed ? "unlist" : "list";
    try {
      const response = await adminApiClient.patch(
        `/music/listed-or-unlisted/${musicId}/${status}`
      );
      if (response.data === "action successfull") {
        toast.success(
          `Music ${username} has been ${status === "unlist" ? "unlisted" : "listed"
          }`
        );
        fetchMusic(page, 10);
      } else {
        toast.success(response.data);
      }
      return;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const parsed = createMusicSchema.safeParse({
      title,
    });
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();

    const formData = new FormData();

    if (
      !imageRef.current?.files ||
      (!imageRef.current.files[0] && title === titleInput)
    ) {
      toast.error("No changes were made");
      setLoading(false);
      return;
    }

    formData.append("title", titleInput);
    if (imageRef.current.files[0]) {
      formData.append("image", imageRef.current.files[0]);
    }

    try {
      const response = await adminApiClient.patch(
        `/music/edit-music/${id}`,
        formData
      );
      fetchMusic(1, 10);
      toast.success(response.data.message);
      setLoading(false);
      onOpenChange();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
        setLoading(false);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
        setLoading(false);
      }
    }
  };

  const handleModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      setImage1(image);
      setTitleInput(title);
    }
    onOpenChange();
  };

  const handleChooseImage = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length === 1) {
      const file = files[0];

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only images are allowed.");
        return;
      }

      const maxSizeInMB = 10;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSizeInMB}MB.`);
        return;
      }

      setImage1(URL.createObjectURL(file));
    } else {
      toast.error("Please select one file to upload.");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} size="lg" onOpenChange={handleModalChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center border-1">
                Edit Music
              </ModalHeader>
              <ModalBody className="p-8 border-1 w-full h-full flex flex-col gap-6">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-md border overflow-hidden mr-4">
                    <img
                      src={image1}
                      alt="Upload"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleChooseImage}
                    className="border"
                  >
                    {image1 ? "Change image" : "Choose a image"}
                  </Button>
                  <input
                    ref={imageRef}
                    hidden
                    onChange={handleImageUpload}
                    type="file"
                    className="border rounded-md p-2 cursor-pointer"
                    accept="image/*"
                  />
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 text-sm font-medium">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      placeholder="Enter Title"
                      className="p-3 border outline-none bg-transparent shadow text-sm rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    onClick={handleSubmit}
                    style={{ minWidth: "100px" }}
                    className={`border ${loading && "opacity-60 cursor-not-allowed"
                      }`}
                  >
                    {loading ? <div className="spinner"></div> : "Submit"}
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Action</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onOpen}>Edit Music</DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleAction(e, id, isListed, title)}
          >
            {isListed ? "Unlist" : "List"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MusicAction;
