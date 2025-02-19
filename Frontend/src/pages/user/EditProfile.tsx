import ProfileHeaders from "@/components/common/ProfileHeader";
import Sidebar from "@/components/common/Sidebar";
import EditProfileForm from "@/components/profile/EditProfileForm";

const EditProfile = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"profile"} />
      <div className="w-full overflow-auto scrollbar-hidden">
        <ProfileHeaders name={'Edit Profile'} />
        <div className="flex flex-col gap-8 pt-8 items-center">
          <EditProfileForm />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
