import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import Image from "./Image";
import { useEffect, useState } from "react";
import { otpSchema } from "../../validations/authValidations";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import apiClient from "../../apis/apiClient";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const navigate = useNavigate();
  const storedData = sessionStorage.getItem("signUpFormData");
  const parsedData = storedData ? JSON.parse(storedData) : null;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [time, setTime] = useState(120);
  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [time]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!parsedData) {
      toast.error("Unauthorized");
      setLoading(false);
      return;
    }
    const parsed = otpSchema.safeParse({ otp });
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();

    try {
      const response = await apiClient.post(`/auth/register/create-user`, {
        ...parsedData,
        otp,
      });
      setTimeout(() => {
        navigate("/sign-in");
        sessionStorage.removeItem("signUpFormData");
        toast.success(response.data.message);
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
      setLoading(false);
    } finally {
      setResendLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      if (!parsedData) {
        toast.error("Unauthorized");
        setResendLoading(false);
        return;
      }
      setTime(120);
      const response = await apiClient.post(
        `/auth/register/otp-verification`,
        parsedData
      );
      parsedData.id.push(response.data.id);
      sessionStorage.setItem("signUpFormData", JSON.stringify(parsedData));
      toast.success("OTP resend successfully");
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
      setResendLoading(false);
      setLoading(false);
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
            <p className="text-[#C9C9CA] text-xs w-61 mx-auto">
              Enter the code that we sent to your email address : &nbsp;
              {parsedData ? parsedData.email : ""}
            </p>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
            <input
              type="number"
              className="border border-[#252545] text-white hide-arrows outline-none bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              name="email"
              value={otp}
              placeholder="Security Code"
              onChange={(e) => setOtp(e.target.value)}
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
          <div className="text-center">
            <p className="text-white text-lg font-bold">
              Didn't get a security code?&nbsp;
              <span
                className={`${
                  time === 0 && parsedData
                    ? "text-[#52C2FB] hover:underline cursor-pointer"
                    : "text-gray-500 cursor-not-allowed"
                }`}
                onClick={time === 0 ? handleResend : undefined}
              >
                {resendLoading ? <div className="spinner"></div> : "Resend"}
              </span>
              &nbsp;
              {time && parsedData ? (
                <span className="text-white font-normal">
                  in {formatTime(time)}
                </span>
              ) : (
                ""
              )}
            </p>
          </div>
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

export default Otp;
