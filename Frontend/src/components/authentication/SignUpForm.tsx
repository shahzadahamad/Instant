import React, { useState } from "react";
import Image from "./Image";
import { SignUpFormData } from "../../types/authentication/authenticationTypes";
import { signUpSchema } from "../../validations/authValidations";
import toast from "react-hot-toast";
import apiClient from "../../apis/apiClient";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";
import { Eye, EyeOff } from "lucide-react";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<SignUpFormData>({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const parsed = signUpSchema.safeParse(formData);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();
    try {
      const response = await apiClient.post(
        `/auth/register/otp-verification`,
        formData
      );
      const updatedData = {
        ...formData,
        id: [response.data.id],
      };
      sessionStorage.setItem("signUpFormData", JSON.stringify(updatedData));
      toast.success(response.data.message);
      navigate("/otp");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-black w-full md:w-1/2 h-[100vh] flex justify-center items-center">
        <div className="px-10 py-8 w-[100vw] sm:w-[455px] md:w-[353px] lg:w-[428px] flex flex-col gap-6">
          <div className="text-center text-white font-bold">
            <h1 className="text-4xl">Instant</h1>
            <p className="text-[#C9C9CA]">Sign up to get started</p>
          </div>
          <form
            className="flex flex-col gap-3 text-white"
            onSubmit={handleFormSubmit}
          >
            <input
              type="text"
              className="p-3 border outline-none bg-transparent shadow text-sm rounded-md"
              id="fullname"
              placeholder="Fullname"
              onChange={handleInputChanges}
            />
            <input
              type="text"
              className="p-3 border outline-none bg-transparent shadow text-sm rounded-md"
              id="username"
              placeholder="Username"
              onChange={handleInputChanges}
            />
            <input
              type="email"
              className="p-3 border outline-none bg-transparent shadow text-sm rounded-md"
              id="email"
              placeholder="Email address"
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
              disabled={loading}
              className={`w-full h-[2.583rem] outline-none font-bold border rounded-md bg-transparent transition-colors ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "opacity-100 cursor-pointer hover:bg-white hover:text-black"
              }`}
            >
              {loading ? <div className="spinner"></div> : "Sign Up"}
            </button>
          </form>
          <div className="flex items-center gap-2">
            <hr className="flex-grow border-[#101013] " />
            <span className="text-[#65656b] mb-1">Or continue with</span>
            <hr className="flex-grow border-[#101013]" />
          </div>
          <GoogleAuth />
        </div>
      </div>
      <hr className="w-[.9px] h-[85vh] md:block bg-[#1b1b1d]"></hr>
      <Image
        message={true}
        accountMessage={"Have an account ?"}
        loginText={"Log in"}
        forgetPass={false}
      />
    </>
  );
};

export default SignUpForm;
