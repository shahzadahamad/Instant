import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import Image from "./Image";

const Otp = () => {
  return (
    <div className="md:flex block items-center">
      <div className="bg-black w-full md:w-1/2 h-[100vh] flex justify-center items-center">
        <div className="p-10 w-[85vw] sm:w-[455px] md:w-[353px] lg:w-[428px] flex flex-col gap-7">
          <div className="text-center text-white font-bold">
            <h1 className="text-4xl mb-6">Instant</h1>
            <FontAwesomeIcon
              className="text-[#0095F6] text-8xl mb-6"
              icon={faShieldHalved}
            />
            <p className="text-[#C9C9CA] text-xs w-60 mx-auto">
              Enter the code that we sent via WhatsApp to your mobile number:
              +91 ***** ***97
            </p>
          </div>
          <form className="flex flex-col gap-3">
            <input
              type="text"
              className="border border-[#252545] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              name="email"
              placeholder="Security Code"
            />
            <button
              type="button"
              className="w-full h-[2.583rem] font-bold text-white border border-[#737373] rounded bg-[#0095F6]"
            >
              Confirm
            </button>
          </form>
          <div className="text-center">
            <p className="text-white font-bold text-lg hover:cursor-pointer">
              Didn't get a security code?&nbsp;
              <span className="text-[#52C2FB]">Resend</span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-[1px] h-[85vh] hidden md:block bg-[#737373] transform scale-x-50 origin-left"></div>
      <Image
        message={false}
        accountMessage={"Have an account?"}
        loginText={"Log in"}
        forgetPass={false}
      />
    </div>
  );
};

export default Otp;
