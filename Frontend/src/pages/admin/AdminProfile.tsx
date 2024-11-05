import Header from "@/components/admin/common/Header"
import Sidebar from "@/components/admin/common/Sidebar"
import AdminProfileDetials from "@/components/admin/profile/AdminProfileDetials"

const AdminProfile = () => {
  return (
    <div className="flex h-screen overflow-hidden">
    <Sidebar page={'profile'} />
    <div className="w-full flex flex-col overflow-auto">
      <Header title={"Profile"} />
      <AdminProfileDetials />
    </div>
  </div>
  )
}

export default AdminProfile
