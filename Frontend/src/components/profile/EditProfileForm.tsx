import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import apiClient from "../../apis/apiClient";

const EditProfileForm = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [userData, setUserData] = useState({});

  useLayoutEffect(() => {
    const fetchUserData = async () => {
      const res = await apiClient.get("/user/get-data");
      setUserData({...res.data});
    };
    fetchUserData();
  }, []);

  const [profile, setProfile] = useState<{ file: File | null; url: string }>({
    file: null,
    url: "",
  });

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files[0]) {
      setProfile({
        file: files[0],
        url: URL.createObjectURL(files[0]),
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-[#262626] w-3/4 rounded-3xl p-4">
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img
            src={profile.url || currentUser?.profilePicture}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <input
          onChange={handleProfileUpload}
          type="file"
          id="file-upload"
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-[#346688] h-10 text-white py-2 px-4 rounded-xl font-bold hover:bg-[#0095F6] transition-colors"
        >
          Change Photo
        </label>
      </div>
      <form className="w-full flex flex-col items-center gap-5 pb-8">
        <div className="flex gap-10">
          <input
            type="text"
            placeholder="Fullname"
            className="bg-[#262626] p-3 w-[407px] placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl"
          />
          <input
            type="text"
            placeholder="Username"
            className="bg-[#262626] p-3 w-[407px] placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl"
          />
        </div>
        <div className="flex gap-10">
          <input
            type="email"
            placeholder="Email"
            className="bg-[#262626] p-3 w-[407px] placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl"
          />
          <input
            type="number"
            placeholder="Phone number"
            className="bg-[#262626] p-3 w-[407px] placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl hide-arrows"
          />
        </div>
        <div className="flex gap-10">
          <input
            type="date"
            placeholder="Date of birth"
            className="bg-[#262626] p-3 w-[407px] placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl"
          />
          <select className="bg-[#262626] p-3 w-[407px] placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl">
            <option value="" disabled selected>
              Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex gap-10">
          <textarea
            placeholder="Bio"
            className="bg-[#262626] resize-none p-3 w-[407px] h-12 placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl"
          />
          <div className="relative w-[407px]">
            <input
              type="text"
              id="privateAccount"
              placeholder="Private Account"
              disabled
              className="bg-[#262626] p-3 placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl w-full"
            />
            <label
              htmlFor="switch"
              className="absolute inset-y-0 right-4 flex items-center"
            >
              <input type="checkbox" id="switch" hidden className="peer" />
              <span className="absolute inset-0 left-0.5 my-auto block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 peer-checked:translate-x-5"></span>
              <span className="block h-6 w-11 rounded-full border border-gray-950/5 bg-gray-200 transition duration-30 peer-checked:bg-[#0095F6]"></span>
            </label>
          </div>
        </div>
        <div className="flex w-[850px] justify-between gap-10">
          <button className="text-white font-bold bg-red-950 hover:bg-red-900 transition-colors py-2 px-5 rounded-xl">
            Change Password
          </button>
          <button className="text-white font-bold bg-[#346688] hover:bg-[#0095F6] transition-colors py-2 px-14 rounded-xl">
            Confirm
          </button>
        </div>
      </form>
    </>
  );
};

export default EditProfileForm;
