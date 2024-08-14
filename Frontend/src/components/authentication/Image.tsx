import { ImageProps } from "../../types/authentication/imageProps";

const Image = ({accountMessage, loginText}:ImageProps) => {
  return (
    <div className="bg-black w-1/2 h-[100vh] flex flex-col justify-center items-center">
      <img src="./form-image.png" className="w-3/5 h-auto" alt="" />
      <div className="text-center">
        <p className="text-white font-bold text-lg hover:cursor-pointer">
          {accountMessage} <span className="text-[#52C2FB]">{loginText}</span>
        </p>
        {/* <p className="text-[#0070B8] font-bold text-xs">Forgotten your password?</p> */}
      </div>
    </div>
  );
};

export default Image;
