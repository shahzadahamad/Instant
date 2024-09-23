import Sidebar from "@/components/common/Sidebar";
import CreatePostBody from "@/components/create-post/CreatePostBody";
import CreatePostHeader from "@/components/create-post/CreatePostHeader";

const CreatePost = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="w-full flex flex-col overflow-auto">
        <CreatePostHeader />
        <div className="flex flex-col gap-8 pt-8 items-center">
          <CreatePostBody />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
