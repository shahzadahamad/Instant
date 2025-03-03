import Sidebar from "@/components/common/Sidebar"
import PostSingle from "@/components/post/PostSingle"

const Post = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"none"} />
      <div className="w-full overflow-auto scrollbar-hidden">
        <PostSingle />
      </div>
    </div>
  )
}

export default Post
