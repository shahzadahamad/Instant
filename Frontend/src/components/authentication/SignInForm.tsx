import { useState } from "react";
import Image from "../common/Image";
import { useNavigate } from "react-router-dom";
import { signInSchema } from "../../validations/authValidations";
import toast from "react-hot-toast";
import apiClient from "../../apis/apiClient";
import { AxiosError } from "axios";
import GoogleAuth from "./GoogleAuth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/userSlice";
import { Eye, EyeOff } from "lucide-react";
import { FormData } from "@/types/authentication/authenticationTypes";

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    usernameOrEmail: "",
    password: "",
  });
  const dispatch = useDispatch();

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
      const currentUser = response.data.user;
      localStorage.setItem("token", token);
      dispatch(loginSuccess(currentUser));
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
            <h1 className="text-4xl">Instant</h1>
            <p className="text-[#C9C9CA]">Welcome back</p>
          </div>
          <form
            className="flex flex-col text-white gap-3"
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
                className="p-3 border w-full outline-none bg-transparent shadow text-sm rounded-md"
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
          <div className="flex items-center gap-2">
            <hr className="flex-grow border-[#1b1b1d] " />
            <span className="text-[#65656b] mb-1">Or continue with</span>
            <hr className="flex-grow border-[#1b1b1d]" />
          </div>
          <GoogleAuth />
        </div>
      </div>
      <hr className="w-[.9px] h-[85vh] hidden md:block bg-[#1b1b1d]"></hr>
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
