import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved";
import Image from "./Image";
import { useState } from "react";
import { forgotPassSchema } from "../../validations/authValidations";
import toast from "react-hot-toast";
import apiClient from "../../apis/apiClient";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const ForgotPassword = () => {
  const [emailOrUsername, setUsernameOrEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const parsed = forgotPassSchema.safeParse({ emailOrUsername });
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();
    try {
      const response = await apiClient.post(`/auth/forgot-password`, {
        emailOrUsername,
      });
      navigate("/sign-in");
      toast.success(response.data.message);
      setLoading(false);
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
            <p className="text-white text-sm mb-1">Trouble with logging in?</p>
            <p className="text-[#C9C9CA] text-xs md:w-72  mx-auto">
              Enter your email address or username, and we'll send you a link to
              get back into your account.
            </p>
          </div>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              className="border border-[#252545] text-white outline-none bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              name="usernameOrEmail"
              value={emailOrUsername}
              placeholder="Email address or username"
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
            <button
              type="submit"
              className={`w-full h-[2.583rem] outline-none font-bold text-white border border-[#737373] rounded bg-[#0095F6] ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "opacity-100 cursor-pointer"
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

export default ForgotPassword;
