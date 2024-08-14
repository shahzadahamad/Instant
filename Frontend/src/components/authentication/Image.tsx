import { Link } from "react-router-dom";
import { ImageProps } from "../../types/authentication/imageProps";

const Image = ({ accountMessage, loginText, forgetPass }: ImageProps) => {
  return (
    <div className="bg-black w-1/2 h-[100vh] flex flex-col justify-center items-center">
      <img src="./form-image.png" className="w-3/5 h-auto" alt="" />
      <div className="text-center">
        <p className="text-white font-bold text-lg hover:cursor-pointer">
          {accountMessage}&nbsp; 
          <Link to={forgetPass ? "/sign-up" : "/sign-in"}>
            <span className="text-[#52C2FB]">{loginText}</span>
          </Link>
        </p>
        {forgetPass ? (
          <p className="text-[#0070B8] font-bold text-base">
            Forgotten your password?
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Image;
