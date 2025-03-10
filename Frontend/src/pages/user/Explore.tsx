import Sidebar from "@/components/common/Sidebar"
import ExploreDetials from "@/components/explore/ExploreDetials"

const Explore = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"explore"} />
      <ExploreDetials />
    </div>
  )
}

export default Explore
