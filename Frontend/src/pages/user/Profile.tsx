import Sidebar from "@/components/common/Sidebar";
import ProfileDetials from "@/components/profile/ProfileDetials";

const Profile = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"profile"} />
      <div className="w-full overflow-auto scrollbar-hidden">
        <ProfileDetials />
      </div>
    </div>
  );
};

export default Profile;
