import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import apiClient from "../../apis/apiClient";
import { GetUserData } from "../../types/profile/profile";
import toast from "react-hot-toast";
import { editProfileSchema } from "../../validations/authValidations";
import { AxiosError } from "axios";
import { loginSuccess } from "../../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      setTimeout(() => {
        dispatch(loginSuccess(updatedUser));
        navigate("/profile");
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
      <div className="flex items-center justify-between bg-transparent border w-3/4 rounded-md p-4">
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
            className="cursor-pointer bg-transparent border text-sm p-2 rounded-md hover:bg-white hover:text-black transition-colors text-center"
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
            className="cursor-pointer bg-transparent border text-sm p-2 rounded-md hover:bg-[#B22222] transition-colors text-center"
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
            className="p-3 border outline-none bg-transparent w-[407px] shadow text-sm rounded-md"
          />
          <input
            type="text"
            id="username"
            onChange={handleInputChange}
            defaultValue={userData.username}
            placeholder="Username"
            className="p-3 border outline-none bg-transparent w-[407px] shadow text-sm rounded-md"
          />
        </div>
        <div className="flex gap-10">
          <input
            type="email"
            id="email"
            onChange={handleInputChange}
            disabled
            defaultValue={userData.email}
            placeholder="Email"
            className="p-3 border outline-none bg-transparent w-[407px] shadow text-sm rounded-md"
          />
          <input
            type="number"
            id="phoneNumber"
            onChange={handleInputChange}
            defaultValue={userData.phoneNumber || ""}
            placeholder="Phone number"
            className="p-3 border outline-none hide-arrows bg-transparent w-[407px] shadow text-sm rounded-md"
          />
        </div>
        <div className="flex gap-10">
          <input
            type="date"
            id="dateOfBirth"
            onChange={handleInputChange}
            defaultValue={userData.dateOfBirth || ""}
            placeholder="Date of birth"
            className="p-3 border outline-none bg-transparent w-[407px] shadow text-sm rounded-md"
          />
          <Select
            value={userData.gender}
            onValueChange={(value) => {
              setUserData((prev) => ({
                ...prev,
                gender: value,
              }));
            }}
          >
            <SelectTrigger
              value={userData.gender}
              className="w-[407px] no-outline py-6 border bg-transparent shadow text-sm rounded-md"
            >
              <SelectValue placeholder="Select a gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Genders</SelectLabel>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
            className="bg-transparent border shadow scrollbar-hidden resize-none text-sm p-3 w-[407px] h-12 outline-none rounded-md"
          />
          <div className="relative w-[407px]">
            <input
              type="text"
              id="privateAccount"
              placeholder="Private Account"
              disabled
              className={`bg-transparent p-3 border text-sm shadow w-[407px] outline-none rounded-md`}
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
            className="w-44 bg-transparent hover:bg-[#B22222] border transition-colors p-2 text-sm rounded-md"
          >
            Change Password
          </button>
          <button
            type="submit"
            className={` w-44 bg-transparent transition-colors p-2 border text-sm rounded-md ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "opacity-100 cursor-pointer hover:bg-white hover:text-black"
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
