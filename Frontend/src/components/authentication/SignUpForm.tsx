import React, { useState } from "react";
import Image from "./Image";
import { SignUpFormData } from "../../types/authentication/authenticationTypes";
import { signUpSchema } from "../../validations/authValidations";
import toast from "react-hot-toast";
import apiClient from "../../apis/apiClient";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";

const SignUpForm = () => {
  const navigate = useNavigate();

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
        <div className="p-10 w-[100vw] sm:w-[455px] md:w-[353px] lg:w-[428px] flex flex-col gap-6">
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
              className="border border-[#515152] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold outline-none"
              id="fullname"
              placeholder="Fullname"
              onChange={handleInputChanges}
            />
            <input
              type="text"
              className="border border-[#515152] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold outline-none"
              id="username"
              placeholder="Username"
              onChange={handleInputChanges}
            />
            <input
              type="email"
              className="border border-[#515152] bg-[#252627] text-white p-2 rounded placeholder-[#737373] placeholder-bold outline-none"
              id="email"
              placeholder="Email address"
              onChange={handleInputChanges}
            />
            <input
              type="password"
              className="border border-[#515152] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold outline-none"
              id="password"
              placeholder="Password"
              onChange={handleInputChanges}
            />
            <input
              type="password"
              className="border border-[#515152] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold outline-none"
              id="confirmPassword"
              placeholder="Confirm password"
              onChange={handleInputChanges}
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-[2.583rem] outline-none font-bold text-white border border-[#737373] rounded bg-[#0095F6] ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "opacity-100 cursor-pointer"
              }`}
            >
              {loading ? <div className="spinner"></div> : "Sign Up"}
            </button>
          </form>
          <div className="flex items-center gap-2">
            <hr className="flex-grow border-[#737373] " />
            <span className="text-[#737373] font-bold mb-1">OR</span>
            <hr className="flex-grow border-[#737373]" />
          </div>
          <GoogleAuth />
        </div>
      </div>
      <div className="w-[.9px] h-[85vh] hidden md:block bg-[#737373] transform scale-x-50 origin-left"></div>
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
