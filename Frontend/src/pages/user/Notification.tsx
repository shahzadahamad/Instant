import Sidebar from "@/components/common/Sidebar"
import NotificationDetials from "@/components/notification/NotificationDetials"

const Notification = () => {
  return (
    <div className="flex h-screen">
      <Sidebar page={"notification"} />
      <NotificationDetials />
    </div>
  )
}

export default Notification
