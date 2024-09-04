import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import apiClient from "../../apis/apiClient";
import { GetUserData } from "../../types/profile/profile";
import toast from "react-hot-toast";
import { editProfileSchema } from "../../validations/authValidations";
import { AxiosError } from "axios";
import { loginSuccess } from "../../redux/slice/userSlice";

const EditProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [image, setImage] = useState("");
  const [userData, setUserData] = useState<GetUserData>({
    fullname: "",
    username: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
    gender: "",
    dateOfBirth: "",
    bio: "",
    isPrivateAccount: false,
  });

  useLayoutEffect(() => {
    const fetchUserData = async () => {
      const res = await apiClient.get(
        `/user/edit-profile/get-data/${currentUser?._id}`
      );
      setUserData({ ...res.data });
    };
    fetchUserData();
  }, [currentUser?._id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length === 1) {
      const file = files[0];

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only images are allowed.");
        return;
      }

      const maxSizeInMB = 10;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSizeInMB}MB.`);
        return;
      }

      setImage(URL.createObjectURL(file));
      setUserData((prev) => ({
        ...prev,
        profilePicture: file,
      }));
    } else {
      toast.error("Please select one file to upload.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const parsed = editProfileSchema.safeParse(userData);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();

    const formData = new FormData();

    if (userData.profilePicture instanceof File) {
      formData.append("profilePicture", userData.profilePicture);
    }

    Object.entries(userData).forEach(([key, value]) => {
      if (
        key === "profilePicture" &&
        !(userData.profilePicture instanceof File)
      ) {
        formData.append(key, value.toString());
      }
      if (key !== "profilePicture" && typeof value !== "object") {
        formData.append(key, value.toString());
      }
    });

    try {
      const response = await apiClient.post(
        `/user/edit-profile/${currentUser?._id}`,
        formData
      );
      const updatedUser = response.data.user;
      dispatch(loginSuccess(updatedUser));
      setTimeout(() => {
        toast.success(response.data.message);
        setLoading(false);
      }, 1000);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
        setLoading(false);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-[#262626] w-3/4 rounded-3xl p-4">
        <div className="w-20 h-20 rounded-full border overflow-hidden">
          <img
            src={image || currentUser?.profilePicture}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2">
          <input
            onChange={handleProfileUpload}
            type="file"
            accept="image/*"
            id="file-upload"
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-[#346688] text-white text-sm p-2 rounded-xl font-bold hover:bg-[#0095F6] transition-colors text-center"
          >
            Change Photo
          </label>
          <label
            onClick={() => {
              setImage(
                currentUser?.profilePicture
                  ? "https://static.vecteezy.com/system/resources/previews/026/966/960/original/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                  : ""
              );
              setUserData((prev) => ({
                ...prev,
                profilePicture:
                  "https://static.vecteezy.com/system/resources/previews/026/966/960/original/default-avatar-profile-icon-of-social-media-user-vector.jpg",
              }));
            }}
            htmlFor=""
            className="cursor-pointer bg-red-950 text-white text-sm p-2 rounded-xl font-bold hover:bg-red-900 transition-colors text-center"
          >
            Remove Photo
          </label>
        </div>
      </div>
      <form
        onSubmit={handleFormSubmit}
        className="w-full flex flex-col items-center gap-5 pb-8"
      >
        <div className="flex gap-10">
          <input
            type="text"
            id="fullname"
            onChange={handleInputChange}
            defaultValue={userData.fullname}
            placeholder="Fullname"
            className="bg-[#262626] p-3 w-[407px] placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl"
          />
          <input
            type="text"
            id="username"
            onChange={handleInputChange}
            defaultValue={userData.username}
            placeholder="Username"
            className="bg-[#262626] p-3 w-[407px] placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl"
          />
        </div>
        <div className="flex gap-10">
          <input
            type="email"
            id="email"
            onChange={handleInputChange}
            defaultValue={userData.email}
            placeholder="Email"
            className="bg-[#262626] p-3 w-[407px] placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl"
          />
          <input
            type="number"
            id="phoneNumber"
            onChange={handleInputChange}
            defaultValue={userData.phoneNumber || ""}
            placeholder="Phone number"
            className="bg-[#262626] p-3 w-[407px] placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl hide-arrows"
          />
        </div>
        <div className="flex gap-10">
          <input
            type="date"
            id="dateOfBirth"
            onChange={handleInputChange}
            defaultValue={userData.dateOfBirth || ""}
            placeholder="Date of birth"
            className="bg-[#262626] p-3 w-[407px] placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl"
          />
          <select
            value={userData.gender}
            onChange={(e) => {
              setUserData((prev) => ({
                ...prev,
                gender: e.target.value,
              }));
            }}
            className={`bg-[#262626] p-3 w-[407px] placeholder-bold ${
              userData.gender ? "text-white" : "text-[#737373]"
            } text-[#737373] outline-none rounded-xl`}
          >
            <option value="" disabled>
              Gender
            </option>
            <option className="text-white" value="Male">
              Male
            </option>
            <option className="text-white" value="Female">
              Female
            </option>
            <option className="text-white" value="Other">
              Other
            </option>
          </select>
        </div>
        <div className="flex gap-10">
          <textarea
            id="bio"
            placeholder="Bio"
            onChange={(e) => {
              setUserData((prev) => ({
                ...prev,
                bio: e.target.value,
              }));
            }}
            defaultValue={userData.bio || ""}
            className="bg-[#262626] scrollbar-hidden resize-none p-3 w-[407px] h-12 placeholder-bold placeholder-[#737373] text-white outline-none rounded-xl"
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
              <input
                type="checkbox"
                id="switch"
                hidden
                className="peer"
                checked={userData.isPrivateAccount}
                onChange={() => {
                  setUserData((prev) => ({
                    ...prev,
                    isPrivateAccount: !userData.isPrivateAccount,
                  }));
                }}
              />
              <span className="absolute inset-0 left-0.5 my-auto block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 peer-checked:translate-x-5"></span>
              <span className="block h-6 w-11 rounded-full border border-gray-950/5 bg-gray-200 transition duration-300 peer-checked:bg-[#0095F6]"></span>
            </label>
          </div>
        </div>
        <div className="flex w-[850px] justify-between gap-10">
          <button
            type="button"
            className="text-white w-44 font-bold bg-red-950 hover:bg-red-900 transition-colors py-2 px-5 rounded-xl"
          >
            Change Password
          </button>
          <button
            type="submit"
            className={`text-white w-44 font-bold bg-[#346688] hover:bg-[#0095F6] transition-colors py-2 px-14 rounded-xl ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "opacity-100 cursor-pointer"
            }`}
          >
            {loading ? <div className="spinner"></div> : "Confirm"}
          </button>
        </div>
      </form>
    </>
  );
};

export default EditProfileForm;
