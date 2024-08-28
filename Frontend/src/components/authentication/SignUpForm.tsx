import Image from "./Image";

const SignUpForm = () => {
  return (
    <>
      <div className="bg-black w-full md:w-1/2 h-[100vh] flex justify-center items-center">
        <div className="p-10 w-[100vw] sm:w-[455px] md:w-[353px] lg:w-[428px] flex flex-col gap-6">
          <div className="text-center text-white font-bold">
            <h1 className="text-4xl">Instant</h1>
            <p className="text-[#C9C9CA]">Sign up to get started</p>
          </div>
          <form className="flex flex-col gap-3">
            <input
              type="text"
              className="border border-[#515152] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              name="fullname"
              placeholder="Fullname"
            />
            <input
              type="text"
              className="border border-[#515152] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              name="username"
              placeholder="Username"
            />
            <input
              type="email"
              className="border border-[#515152] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              name="email"
              placeholder="Email address"
            />
            <input
              type="password"
              className="border border-[#515152] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              name="password"
              placeholder="Password"
            />
            <input
              type="password"
              className="border border-[#515152] bg-[#252627] p-2 rounded placeholder-[#737373] placeholder-bold"
              name="cpassword"
              placeholder="Confirm password"
            />
            <button
              type="button"
              className="w-full h-[2.583rem] font-bold text-white border border-[#737373] rounded bg-[#0095F6]"
            >
              Sign Up
            </button>
          </form>
          <div className="flex items-center gap-2">
            <hr className="flex-grow border-[#737373] " />
            <span className="text-[#737373] font-bold mb-1">OR</span>
            <hr className="flex-grow border-[#737373]" />
          </div>
          <div>
            <button className="w-full h-[2.583rem] rounded font-bold bg-[#DD4B39]  flex items-center justify-center text-white border-[#737373]">
              <img src="./google.png" className="w-[25px] h-auto" alt="" />
              &nbsp;&nbsp;
              <span>Continue with google</span>
            </button>
          </div>
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
