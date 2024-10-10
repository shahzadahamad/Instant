import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import "../../styles/instant.css";
import CreatePostFilters from "./CreatePostFilters";
import { useDispatch, useSelector } from "react-redux";
import { setPostIndex, setStateDefualt } from "@/redux/slice/postSlice";
import { RootState } from "@/redux/store/store";
import "../../styles/instant.css";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import apiClient from "@/apis/apiClient";
import { GetSelectMusicData } from "@/types/create-post/create-post";
import ChangePost from "./ChangePost";
import SelectAspectRatio from "./SelectAspectRatio";
import TagUser from "./TagUser";

const CreatePostBody = () => {
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const { post, postIndex, musicId, postHoverFilterClass } = useSelector(
    (state: RootState) => state.post
  );

  useEffect(() => {
    dispatch(setStateDefualt());
    return () => {};
  }, [dispatch]);

  const [music, setMusic] = useState<GetSelectMusicData | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const fetchMusic = async (id: string) => {
    try {
      const response = await apiClient.get(
        `/user/music/create-post/get-selected-music-data/${id}`
      );
      setMusic(response.data);
    } catch (error) {
      console.error("Error fetching music:", error);
    }
  };

  useEffect(() => {
    if (musicId) {
      fetchMusic(musicId);
      setIsPlaying(true);
    }
    return () => {};
  }, [musicId]);

  const handleNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (post && post.length > 0) {
      const newIndex = (postIndex + 1) % post.length;
      dispatch(setPostIndex(newIndex));
    }
  };

  const handlePreviousImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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

  const handleAudioControl = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
      <div className="col-span-12 md:col-span-7">
        <Tabs defaultValue="post" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="post">Post</TabsTrigger>
            {post.length > 0 && (
              <>
                <TabsTrigger value="change">Add Post</TabsTrigger>
                <TabsTrigger value="tag-user">Tag users</TabsTrigger>
              </>
            )}
          </TabsList>
          <TabsContent value="post">
            <div className="w-[30rem] h-[70vh] border flex justify-center items-center rounded-md overflow-hidden mt-4 relative">
              {post && post.length > 0 ? (
                <>
                  {post[postIndex].type === "image" ? (
                    <div
                      style={filterStyles}
                      className="w-full h-full relative flex items-center justify-center"
                    >
                      <img
                        className={`absolute w-full h-full rounded-md object-contain ${
                          postHoverFilterClass ||
                          post[postIndex].filterClass
                        }`}
                        src={post[postIndex].url}
                        alt="Uploaded content"
                      />
                    </div>
                  ) : (
                    <>
                      <div
                        style={filterStyles}
                        className="w-full h-full relative flex items-center justify-center"
                      >
                        <video
                          className={`w-full rounded-md h-full object-contain ${
                            postHoverFilterClass ||
                            post[postIndex].filterClass
                          }`}
                          ref={videoRef}
                          controls
                          muted={musicId ? true : false}
                          autoPlay
                          src={post[postIndex].url}
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <SelectAspectRatio />
              )}
              {post && post.length > 0 && (
                <>
                  {post.length > 1 && (
                    <>
                      {postIndex < post.length - 1 && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
                          <button
                            onClick={handleNextImage}
                            className="w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-20 cursor-pointer transition-colors flex items-center justify-center"
                          >
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              className="text-white text-[15px]"
                            />
                          </button>
                        </div>
                      )}

                      {postIndex > 0 && (
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
                          <button
                            onClick={handlePreviousImage}
                            className="w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-20 cursor-pointer transition-colors flex items-center justify-center"
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
                  {musicId && music && (
                    <>
                      <audio
                        ref={audioRef}
                        id="audio"
                        src={music.music}
                        autoPlay={isPlaying}
                      ></audio>
                      <Button
                        onClick={handleAudioControl}
                        variant="outline"
                        className="absolute bottom-2 border-none text-white z-10 hover:text-white right-2 w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-20 transition-colors flex items-center cursor-pointer justify-center"
                      >
                        {isPlaying ? (
                          <VolumeUpIcon style={{ fontSize: "15px" }} />
                        ) : (
                          <VolumeOffIcon style={{ fontSize: "15px" }} />
                        )}
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="change" className="">
            <div className="w-[30rem] h-[70vh] border rounded-md p-2 mt-4">
              <ChangePost />
            </div>
          </TabsContent>
          <TabsContent value="tag-user" className="">
            <div className="w-[30rem] h-[70vh] border rounded-md p-2 mt-4">
              <TagUser />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <CreatePostFilters />
    </div>
  );
};

export default CreatePostBody;
