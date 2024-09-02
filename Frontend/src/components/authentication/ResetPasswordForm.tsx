import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "./Image";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { resetPassSchema } from "../../validations/authValidations";
import toast from "react-hot-toast";
import apiClient from "../../apis/apiClient";
import { AxiosError } from "axios";

const ResetPasswordForm = () => {
  const { _id, token } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
            <input
              type="password"
              onChange={handleInputChanges}
              className="border border-[#252545] text-white outline-none bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              id="password"
              placeholder="Password"
            />
            <input
              type="password"
              onChange={handleInputChanges}
              className="border border-[#252545] text-white outline-none bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              id="confirmPassword"
              placeholder="Confirm Password"
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

export default ResetPasswordForm;
