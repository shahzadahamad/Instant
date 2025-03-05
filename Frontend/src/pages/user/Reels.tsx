import Sidebar from "@/components/common/Sidebar"
import ReelsDetials from "@/components/reel/ReelsDetials"

const Reels = () => {
  return (
    <div className="flex h-screen">
      <Sidebar page={"reel"} />
      <ReelsDetials />
    </div>
  )
}

export default Reels
