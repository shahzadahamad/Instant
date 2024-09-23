import { useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ui/theme-provider";
import "../../styles/instant.css";
import CreatePostFilters from "./CreatePostFilters";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPostIndex } from "@/redux/slice/postSlice";
import { RootState } from "@/redux/store/store";
import "../../styles/instant.css";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const CreatePostBody = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState("bottom");
  const { post, postIndex, postHoverFilterClass } = useSelector(
    (state: RootState) => state.post
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files) {
      if (files.length > 10) {
        toast.error("10 files allowed!");
      }
      const limitedFiles = Array.from(files).slice(0, 10);
      const fileData = limitedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image",
        postFilterClass: "",
        customFilter: [
          { label: "Contrast", value: 100, field: "contrast" },
          { label: "Brightness", value: 100, field: "brightness" },
          { label: "Saturation", value: 100, field: "saturate" },
          { label: "Sepia", value: 0, field: "sepia" },
          { label: "Gray Scale", value: 0, field: "gray" },
        ],
      }));
      dispatch(setPost(fileData));
      dispatch(setPostIndex(0));
    }
  };

  const handleNextImage = () => {
    if (post && post.length > 0) {
      const newIndex = (postIndex + 1) % post.length;
      dispatch(setPostIndex(newIndex));
    }
  };

  const handlePreviousImage = () => {
    if (post && post.length > 0) {
      const newIndex = (postIndex - 1 + post.length) % post.length;
      dispatch(setPostIndex(newIndex));
    }
  };

  const filterStyles = {
    filter: `
    contrast(${
      post && post.length > 0 && post[postIndex]
        ? post[postIndex].customFilter[0].value
        : 100
    }%)
    brightness(${
      post && post.length > 0 && post[postIndex]
        ? post[postIndex].customFilter[1].value
        : 100
    }%)
    saturate(${
      post && post.length > 0 && post[postIndex]
        ? post[postIndex].customFilter[2].value
        : 100
    }%)
    sepia(${
      post && post.length > 0 && post[postIndex]
        ? post[postIndex].customFilter[3].value
        : 0
    }%)
    grayscale(${
      post && post.length > 0 && post[postIndex]
        ? post[postIndex].customFilter[4].value
        : 0
    }%)
  `,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
      <div className="col-span-12 md:col-span-7">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Post</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="w-[30rem] h-[70vh] border rounded-md p-2 mt-4">
          <div
            style={filterStyles}
            className="w-full h-full object-cover flex items-center justify-center cursor-pointer overflow-hidden relative"
          >
            {post && post.length > 0 ? (
              <>
                {post[postIndex].type === "image" ? (
                  <img
                    className={`w-full rounded-md h-full object-cover ${
                      postHoverFilterClass || post[postIndex].postFilterClass
                    }`}
                    src={post[postIndex].url}
                    alt="Uploaded content"
                  />
                ) : (
                  <video
                    className={`w-full rounded-md h-full object-cover ${
                      postHoverFilterClass || post[postIndex].postFilterClass
                    }`}
                    // controls
                    autoPlay
                    src={post[postIndex].url}
                  />
                )}
                {post.length > 1 && (
                  <>
                    {/* Right Arrow */}
                    {postIndex < post.length - 1 && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <button
                          onClick={handleNextImage}
                          className="w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-20 transition-colors flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-white text-[14px]"
                          />
                        </button>
                      </div>
                    )}

                    {/* Left Arrow */}
                    {postIndex > 0 && (
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                        <button
                          onClick={handlePreviousImage}
                          className="w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-20 transition-colors flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="text-white text-[14px]"
                          />
                        </button>
                      </div>
                    )}
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="absolute bottom-2 left-2 w-10 h-10 rounded-full bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-20 transition-colors flex items-center cursor-pointer justify-center"
                  >
                    <Button variant="outline">
                      <AspectRatioIcon style={{ fontSize: "18px" }} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-28">
                    <DropdownMenuLabel>Aspect Ratio</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={position}
                      onValueChange={setPosition}
                    >
                      <DropdownMenuRadioItem value="top">
                        1:1
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="bottom">
                        4:5
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="right">
                        16:9
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <button
                onClick={() =>
                  uploadInputRef.current && uploadInputRef.current.click()
                }
                className={`bg-transparen transition-colors p-2 border text-sm rounded-md ${
                  theme === "dark"
                    ? "hover:bg-white hover:text-black"
                    : "hover:bg-black hover:text-white"
                }`}
              >
                Upload Post
              </button>
            )}
          </div>
        </div>
        <input
          onChange={handleInputChange}
          ref={uploadInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
        />
      </div>
      <CreatePostFilters />
    </div>
  );
};

export default CreatePostBody;
