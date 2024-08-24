import Sidebar from "../components/common/Sidebar";
import ProfileDetials from "../components/profile/ProfileDetials";
import ProfilePostSection from "../components/profile/ProfilePostSection";

const Profile = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="w-full overflow-auto scrollbar-hidden">
        <ProfileDetials />
        <ProfilePostSection />
      </div>
    </div>
  );
};

export default Profile;
