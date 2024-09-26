import React, { useState } from "react";
import formImage from "/form-image.png";
import { FormData } from "@/types/authentication/authenticationTypes";
import { AdminSignInSchema } from "../../validations/authValidations";
import toast from "react-hot-toast";
import apiClient from "../../apis/apiClient";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { AdminLoginSuccess } from "@/redux/slice/admin/adminSlice";

const SignInForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const parsed = AdminSignInSchema.safeParse(formData);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();
    try {
      const response = await apiClient.post(`/admin/auth/login`, formData);
      const token = response.data.token;
      const currentAdmin = response.data.admin;
      localStorage.setItem("adminToken", token);
      dispatch(AdminLoginSuccess(currentAdmin));
      setTimeout(() => {
        navigate("/admin/dashboard");
        toast.success("Welcome, back!");
        setLoading(false);
      }, 1000);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <div className="bg-black w-full md:w-1/2 h-[100vh] flex justify-center items-center">
        <div className="px-10 py-8 w-[100vw] sm:w-[455px] md:w-[353px] lg:w-[428px] flex flex-col gap-6">
          <div className="text-center text-white font-bold">
            <h1 className="text-4xl">Instant</h1>
            <p className="text-[#C9C9CA]">Welcome, back</p>
          </div>
          <form
            className="flex flex-col gap-3 text-white"
            onSubmit={handleFormSubmit}
          >
            <input
              type="text"
              className="p-3 border outline-none bg-transparent shadow text-sm rounded-md"
              id="usernameOrEmail"
              placeholder="Email address or username"
              onChange={handleInputChanges}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="p-3 w-full border outline-none bg-transparent shadow text-sm rounded-md"
                id="password"
                placeholder="Password"
                onChange={handleInputChanges}
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
            <button
              type="submit"
              disabled={loading}
              className={`h-[2.583rem] outline-none font-bold border rounded-md bg-transparent text-sm transition-colors ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "opacity-100 cursor-pointer hover:bg-white hover:text-black"
              }`}
            >
              {loading ? <div className="spinner"></div> : "Log In"}
            </button>
          </form>
        </div>
      </div>
      <hr className="w-[.9px] h-[85vh] hidden md:block bg-[#1b1b1d]"></hr>
      <div className="bg-black w-1/2 h-[100vh] hidden md:flex flex-col justify-center items-center">
        <img
          src={formImage}
          className="w-3/5 md:w-3/4 lg:w-3/5 h-auto"
          alt="Authentication"
        />
      </div>
    </>
  );
};

export default SignInForm;
