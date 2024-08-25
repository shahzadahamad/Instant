import Sidebar from "../components/common/Sidebar";
import EditProfileForm from "../components/profile/EditProfileForm";
import EditProfileHeader from "../components/profile/EditProfileHeader";
import EditProfileUpload from "../components/profile/EditProfileUpload";

const EditProfile = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="w-full overflow-auto scrollbar-hidden">
        <EditProfileHeader />
        <div className="flex flex-col gap-8 pt-8 items-center">
          <EditProfileUpload />
          <EditProfileForm />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
