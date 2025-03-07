import {
  onHoverOutFilter,
  onHoverUpFilter,
  setPostFilterClass,
} from "@/redux/slice/postSlice";
import { filterValues } from "@/utils/filterValues";
import "../../styles/instant.css";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/redux/store/store";
import CustomFilter from "./CustomFilter";
import { useState } from "react";
import CreatePostMusic from "./CreatePostMusic";
import CreatePostFormSubmit from "./CreatePostFormSubmit";

const CreatePostFilters = () => {
  const dispatch = useDispatch();
  const { post, postIndex } = useSelector((state: RootState) => state.post);
  const [tab, setTabs] = useState("instantFilter");

  return (
    <div className="col-span-12 md:col-span-5">
      {post && post.length > 0 && (
        <Tabs defaultValue="instant-filter" className="w-[400px]">
          <TabsList>
            <TabsTrigger
              value="instant-filter"
              onClick={() => setTabs("instantFilter")}
            >
              Instant Filter
            </TabsTrigger>
            <TabsTrigger
              value="custom-filter"
              onClick={() => setTabs("customFilter")}
            >
              Custom Filter
            </TabsTrigger>
            {post && post[postIndex] && post[postIndex].type !== "video" && post[postIndex].type !== "reel" && post[postIndex].type !== 'story' && (
              <TabsTrigger value="music" onClick={() => setTabs("music")}>
                Music
              </TabsTrigger>
            )}
            <TabsTrigger value="caption" onClick={() => setTabs("caption")}>
              Captions
            </TabsTrigger>
          </TabsList>
          {tab === "instantFilter" ? (
            <TabsContent
              value="instant-filter"
              className={`${post && post.length > 0
                ? "w-[24rem] h-[70vh] transition-transform flex flex-wrap gap-3 justify-start mt-4 border rounded-md p-2 scrollbar-style overflow-auto"
                : ""
                }`}
            >
              {post && post.length > 0
                ? filterValues.map((filter) => (
                  <>
                    <div key={filter.class}>
                      <div
                        className="w-28 h-36 cursor-pointer"
                        onMouseOver={() => {
                          dispatch(onHoverUpFilter(filter.class));
                        }}
                        onMouseOut={() => {
                          dispatch(onHoverOutFilter(""));
                        }}
                        onClick={() => {
                          dispatch(
                            setPostFilterClass({
                              postIndex,
                              filter: filter.class,
                            })
                          );
                        }}
                      >
                        <img
                          src={
                            post[postIndex].type === "image"
                              ? post[postIndex].url
                              : "/view.jpg"
                          }
                          alt=""
                          className={`${filter.class} ${post[postIndex].filterClass === filter.class
                            ? "border-2 border-black dark:border-white"
                            : ""
                            } rounded-md w-full h-full object-cover`}
                        />
                      </div>
                      <h1>{filter.name}</h1>
                    </div>
                  </>
                ))
                : "Upload a Post to Select Filter"}
            </TabsContent>
          ) : tab === "customFilter" ? (
            <TabsContent
              value="custom-filter"
              className={`${post && post.length > 0
                ? "w-[24rem] h-[70vh] transition-transform flex flex-wrap gap-3 justify-start mt-4 border rounded-md p-2 scrollbar-style overflow-auto"
                : ""
                }`}
            >
              <div>
                {post && post.length > 0 ? (
                  <>
                    <CustomFilter />
                  </>
                ) : (
                  <div>Upload a Post to Select Filter</div>
                )}
              </div>
            </TabsContent>
          ) : tab === "music" ? (
            <TabsContent
              value="music"
              className={`${post && post.length > 0
                ? "w-[24rem] h-[70vh] transition-transform flex flex-wrap gap-3 justify-center mt-4 border rounded-md p-2 scrollbar-style overflow-auto"
                : ""
                }`}
            >
              {post && post.length > 0 ? (
                <CreatePostMusic />
              ) : (
                <div>Upload a Post to Select Music</div>
              )}
            </TabsContent>
          ) : (
            <TabsContent
              value="caption"
              className={`${post && post.length > 0
                ? "w-[24rem] h-[70vh] scrollbar-hidden transition-transform flex flex-wrap gap-3 justify-center mt-4 border rounded-md p-2 scrollbar-style overflow-auto"
                : ""
                }`}
            >
              {post && post.length > 0 ? (
                <CreatePostFormSubmit />
              ) : (
                <div>Upload a Post to Set Captions</div>
              )}
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
};

export default CreatePostFilters;
