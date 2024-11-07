import { changePasswordApi } from "@/apis/api/adminApi";
import { adminChangePassword } from "@/validations/authValidations";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";


const AdminProfileChangePassword: React.FC<{ handleChangePassword: (status: boolean) => void }> = ({ handleChangePassword }) => {

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordFromData, setPasswordFromData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFromData({ ...passwordFromData, [e.target.id]: e.target.value });
  };

  const resestStates = () => {
    setShowPassword({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });

    setPasswordFromData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { currentPassword, newPassword } = passwordFromData;

      const parsed = adminChangePassword.safeParse(passwordFromData);
      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((err) => err.message);
        toast.error(errorMessages[0]);
        setLoading(false);
        return;
      }
      toast.dismiss();

      const res = await changePasswordApi(currentPassword, newPassword);
      setTimeout(() => {
        resestStates();
        handleChangePassword(true);
        toast.success(res);
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
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label className="block text-[#a9a6a4] text-sm font-normal mb-1">
          Current Password
        </label>
        <div className="relative">
          <input
            onChange={handleInputChange}
            type={showPassword.currentPassword ? "text" : "password"}
            name="currentPassword"
            id='currentPassword'
            value={passwordFromData.currentPassword}
            className="w-full p-3 border rounded-lg bg-transparent outline-none"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword((prev) => ({
              ...prev,
              currentPassword: !showPassword.currentPassword
            }))}
          >
            {showPassword.currentPassword ? (
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
            onChange={handleInputChange}
            type={showPassword.newPassword ? "text" : "password"}
            name="newPassword"
            value={passwordFromData.newPassword}
            id='newPassword'
            className="w-full p-3 border rounded-lg bg-transparent outline-none"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword((prev) => ({
              ...prev,
              newPassword: !showPassword.newPassword
            }))}
          >
            {showPassword.newPassword ? (
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
            onChange={handleInputChange}
            type={showPassword.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={passwordFromData.confirmPassword}
            id='confirmPassword'
            className="w-full p-3 border rounded-lg bg-transparent outline-none"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword((prev) => ({
              ...prev,
              confirmPassword: !showPassword.confirmPassword
            }))}
          >
            {showPassword.confirmPassword ? (
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
          onClick={() => handleChangePassword(false)}
          className="px-4 py-2 bg-transparent border dark:text-white text-black hover:text-white rounded-lg transition-colors hover:bg-[#B22222] font-medium"
        >
          Cancel
        </button>

        <button
          type="submit"
          className={`px-4 py-2 min-w-24 dark:text-white text-black hover:text-white rounded-lg hover:bg-blue-500 border font-medium transition-colors ${loading
            && "opacity-60 cursor-not-allowed"
            }`}
        >
          {loading ? <div className="spinner"></div> : "Update Password"}
        </button>
      </div>
    </form>
  )
}

export default AdminProfileChangePassword
