import { useState } from "react";
import Image from "./Image";
import { useNavigate } from "react-router-dom";
import { SignInFormData } from "../../types/authentication/authenticationTypes";
import { signInSchema } from "../../validations/authValidations";
import toast from "react-hot-toast";
import apiClient from "../../apis/apiClient";
import { AxiosError } from "axios";
import GoogleAuth from "./GoogleAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignInFormData>({
    usernameOrEmail: "",
    password: "",
  });

  const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const parsed = signInSchema.safeParse(formData);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();
    try {
      const response = await apiClient.post(`/auth/login`, formData);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setTimeout(() => {
        navigate("/");
        toast.success("Login successful!");
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
        <div className="p-10 w-[85vw] sm:w-[455px] md:w-[353px] lg:w-[428px] flex flex-col gap-6">
          <div className="text-center text-white font-bold">
            <h1 className="text-4xl">Instant</h1>
            <p className="text-[#C9C9CA]">Welcome back</p>
          </div>
          <form
            className="flex flex-col text-white gap-3"
            onSubmit={handleFormSubmit}
          >
            <input
              type="text"
              className="border border-[#515152] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold outline-none"
              id="usernameOrEmail"
              placeholder="Email address or username"
              onChange={handleInputChanges}
            />
            <input
              type="password"
              className="border border-[#515152] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold outline-none"
              id="password"
              placeholder="Password"
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
              {loading ? <div className="spinner"></div> : "Log In"}
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
        accountMessage={`Don't have an account ?`}
        loginText={"Sign up"}
        forgetPass={true}
      />
    </>
  );
};

export default SignIn;
