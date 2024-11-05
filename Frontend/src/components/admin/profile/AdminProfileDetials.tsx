import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AdminProfileDetails = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const [edit, setEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordFromRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="h-[88vh] overflow-y-auto scrollbar-hidden">
      <div className="w-full p-6 flex flex-col h-full items-center justify-center">
        <div className="flex w-1/2 items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border overflow-hidden">
              <img
                src="/avatar.png"
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
              disabled={!edit}
              value="shahzad"
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
              disabled={!edit}
              value="shahzad@gmail.com"
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
              onClick={() => setEdit(false)}
              className="px-4 py-1.5 min-w-24 bg-transparent border dark:text-white text-black hover:text-white hover:bg-[#B22222] rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-1.5 min-w-24 border bg-transparent dark:text-white text-black hover:text-white rounded-lg hover:bg-blue-500 font-medium transition-colors"
            >
              Save
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
            <form className="space-y-4">
              <div>
                <label className="block text-[#a9a6a4] text-sm font-normal mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    className="w-full p-3 border rounded-lg bg-transparent outline-none"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <Eye className="text-[#65656b] text-xs" size={20} />
                    ) : (
                      <EyeOff className="text-[#65656b] text-xs" size={20} />
                    )}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#a9a6a4] text-sm font-normal mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    className="w-full p-3 border rounded-lg bg-transparent outline-none"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <Eye className="text-[#65656b] text-xs" size={20} />
                    ) : (
                      <EyeOff className="text-[#65656b] text-xs" size={20} />
                    )}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#a9a6a4] text-sm font-normal mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="w-full p-3 border rounded-lg bg-transparent outline-none"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <Eye className="text-[#65656b] text-xs" size={20} />
                    ) : (
                      <EyeOff className="text-[#65656b] text-xs" size={20} />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 bg-transparent border dark:text-white text-black hover:text-white rounded-lg transition-colors hover:bg-[#B22222] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 dark:text-white text-black hover:text-white rounded-lg hover:bg-blue-500 border font-medium transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileDetails;
