import Sidebar from "@/components/common/Sidebar";
import UserProfileDetials from "@/components/user-profiles/UserProfileDetials";

const UserProfile = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"none"} />
      <div className="w-full overflow-auto scrollbar-hidden">
        <UserProfileDetials />
      </div>
    </div>
  );
};

export default UserProfile;
