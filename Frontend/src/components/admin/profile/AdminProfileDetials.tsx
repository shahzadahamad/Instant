import { useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { GetAdminData, GetAdminFromData } from "@/types/admin/profile";
import { editProfile, getAdminDataApi } from "@/apis/api/adminApi";
import { adminEditProfile } from "@/validations/authValidations";
import { AxiosError } from "axios";
import { adminLoginSuccess } from "@/redux/slice/admin/adminSlice";
import { useDispatch } from "react-redux";
import AdminProfileChangePassword from "./AdminProfileChangePassword";

const AdminProfileDetails = () => {
  const dispatch = useDispatch();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const [edit, setEdit] = useState(false);
  const passwordFromRef = useRef<HTMLDivElement | null>(null);
  const [image, setImage] = useState("");
  const [adminData, setAdminData] = useState<GetAdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminFromData, setAdminFromData] = useState<GetAdminFromData>({
    username: "",
    email: "",
    profilePicture: "",
  });

  useLayoutEffect(() => {
    const fetchAdminData = async () => {
      const res = await getAdminDataApi();
      setAdminData(res);
      setAdminFromData(res);
    };
    fetchAdminData();
  }, []);

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
      setAdminFromData((prev) => ({
        ...prev,
        profilePicture: file,
      }));
    } else {
      toast.error("Please select one file to upload.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminFromData({ ...adminFromData, [e.target.id]: e.target.value });
  };

  const handleChangePassword = (status: boolean) => {
    if (status) {
      setEdit(false);
      setImage("");
      setAdminFromData({
        username: adminData ? adminData.username : "",
        email: adminData ? adminData.email : "",
        profilePicture: adminData ? adminData.profilePicture : "",
      })
      setShowPasswordForm(false);
    } else {
      setShowPasswordForm(false);
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    const parsed = adminEditProfile.safeParse(adminFromData);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();

    const formData = new FormData();

    Object.entries(adminFromData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await editProfile(formData);
      setTimeout(() => {
        dispatch(adminLoginSuccess(response));
        setAdminData({ username: response.username, email: response.email, profilePicture: response.profilePicture });
        setImage("");
        setEdit(false);
        toast.success("Profile Updated");
        setLoading(false);
      }, 500);
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
  }

  return (
    <div className="h-[88vh] overflow-y-auto scrollbar-hidden">
      <div className="w-full p-6 flex flex-col h-full items-center justify-center">
        <div className="flex w-1/2 items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border overflow-hidden">
              <img
                src={(edit ? image : "") || adminData?.profilePicture}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            {edit && (
              <>
                <button
                  onClick={() => profileInputRef.current?.click()}
                  className={`absolute bottom-0 right-0 border-2 border-[#09090b] bg-blue-500 text-white p-2 rounded-full w-8 h-8 flex items-center  justify-center  ${edit ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                    } hover:bg-blue-600 transition-all duration-300 ease-in-out`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </button>
                <input
                  ref={profileInputRef}
                  onChange={handleProfileUpload}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">John Anderson</h1>
            <p className="">john.anderson@example.com</p>
          </div>

          <button
            type="button"
            onClick={() => setEdit(true)}
            className="px-4 py-1.5 bg-transparent border dark:text-white text-black hover:text-white rounded-lg hover:bg-blue-500 font-medium transition-colors"
          >
            Edit Profile
          </button>
        </div>

        <div className="w-1/2 space-y-6 mb-8">
          <div>
            <label className="block text-sm font-normal text-[#a9a6a4] mb-1">
              Username
            </label>
            <input
              type="text"
              onChange={handleInputChange}
              disabled={!edit}
              id="username"
              defaultValue={adminData?.username}
              value={adminFromData.username}
              className={`w-full ${!edit && "cursor-not-allowed"
                } flex items-center border rounded-lg p-3 bg-transparent outline-none`}
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-[#a9a6a4] mb-1">
              Email Address
            </label>
            <input
              type="text"
              onChange={handleInputChange}
              disabled={!edit}
              id="email"
              defaultValue={adminData?.email}
              value={adminFromData.email}
              className={`w-full ${!edit && "cursor-not-allowed"
                } flex items-center border rounded-lg p-3 bg-transparent outline-none`}
            />
          </div>

          <div
            className={`flex gap-3 float-end ${edit ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
              } transition-all duration-300 ease-in-out`}
          >
            <button
              type="button"
              onClick={() => {
                setEdit(false);
                setImage("");
                setAdminFromData({
                  username: adminData ? adminData.username : "",
                  email: adminData ? adminData.email : "",
                  profilePicture: adminData ? adminData.profilePicture : "",
                })
              }}
              className="px-4 py-1.5 min-w-24 bg-transparent border dark:text-white text-black hover:text-white hover:bg-[#B22222] rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`px-4 py-1.5 min-w-24 border bg-transparent  dark:text-white text-black hover:text-white rounded-lg hover:bg-blue-500 font-medium transition-colors ${loading
                && "opacity-60 cursor-not-allowed"
                }`}
            >
              {loading ? <div className="spinner"></div> : "Save"}
            </button>
          </div>
        </div>

        <div
          className={`border-t pt-6 w-1/2 ${edit ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
            } transition-all duration-300 ease-in-out`}
        >
          <button
            onClick={() => {
              setShowPasswordForm(true);
              setTimeout(() => {
                passwordFromRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
                const formRef = passwordFromRef.current;
                formRef?.focus();
              }, 200);
            }}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Change Password
          </button>

          <div
            ref={passwordFromRef}
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showPasswordForm
              ? "max-h-96 opacity-100 pt-6 pb-6"
              : "max-h-0 opacity-0"
              }`}
          >
            <AdminProfileChangePassword handleChangePassword={handleChangePassword} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileDetails;
