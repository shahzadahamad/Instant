import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "./Image";
import { useParams } from "react-router-dom";

const ResetPasswordForm = () => {
  const { _id, token } = useParams();
  console.log(_id,token)
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
          <form className="flex flex-col gap-3">
            <input
              type="password"
              className="border border-[#252545] text-white outline-none bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              name="email"
              placeholder="Password"
            />
            <input
              type="password"
              className="border border-[#252545] text-white outline-none bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              name="email"
              placeholder="Confirm Password"
            />
            <button
              type="button"
              className="w-full h-[2.583rem] font-bold text-white border border-[#737373] rounded bg-[#0095F6]"
            >
              Confirm
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
