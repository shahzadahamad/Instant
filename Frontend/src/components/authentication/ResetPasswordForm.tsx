import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "./Image";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { resetPassSchema } from "../../validations/authValidations";
import toast from "react-hot-toast";
import apiClient from "../../apis/apiClient";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

const ResetPasswordForm = () => {
  const { _id, token } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const parsed = resetPassSchema.safeParse(formData);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();
    try {
      const response = await apiClient.post(
        `/auth/reset-password/${_id}/${token}`,
        formData
      );
      setTimeout(() => {
        navigate("/sign-in");
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
      <div className="bg-black w-full md:w-1/2 h-[100vh] flex justify-center items-center">
        <div className="p-10 w-[85vw] sm:w-[455px] md:w-[353px] lg:w-[428px] flex flex-col gap-6">
          <div className="text-center text-white font-bold">
            <h1 className="text-4xl mb-6">Instant</h1>
            <FontAwesomeIcon
              className="text-[#0095F6] text-8xl mb-6"
              icon={faShieldHalved}
            />
            <h1 className="text-white text-base mb-1">Reset your password</h1>
          </div>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                onChange={handleInputChanges}
                className="p-3 border outline-none bg-transparent shadow text-sm rounded-md w-full"
                id="password"
                placeholder="Password"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {formData.password ? (
                  showPassword ? (
                    <Eye className="text-[#65656b] text-xs" size={20} />
                  ) : (
                    <EyeOff className="text-[#65656b] text-xs" size={20} />
                  )
                ) : (
                  ""
                )}
              </span>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="p-3 w-full border outline-none bg-transparent shadow text-sm rounded-md"
                id="confirmPassword"
                placeholder="Confirm password"
                onChange={handleInputChanges}
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {formData.confirmPassword ? (
                  showConfirmPassword ? (
                    <Eye className="text-[#65656b] text-xs" size={20} />
                  ) : (
                    <EyeOff className="text-[#65656b] text-xs" size={20} />
                  )
                ) : (
                  ""
                )}
              </span>
            </div>
            <button
              type="submit"
              className={`h-[2.583rem] outline-none font-bold border rounded-md bg-transparent text-sm transition-colors ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "opacity-100 cursor-pointer hover:bg-white hover:text-black"
              }`}
            >
              {loading ? <div className="spinner"></div> : "Confirm"}
            </button>
          </form>
        </div>
      </div>
      <div className="w-[.9px] h-[85vh] hidden md:block bg-[#737373] transform scale-x-50 origin-left"></div>
      <Image
        message={false}
        accountMessage={"Have an account?"}
        loginText={"Log in"}
        forgetPass={false}
      />
    </>
  );
};

export default ResetPasswordForm;
