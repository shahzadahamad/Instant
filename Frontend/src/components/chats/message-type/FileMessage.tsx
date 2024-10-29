import MessageProfile from "../MessageProfile";

const FileMessage = () => {
  return (
    <>
      <div className="flex items-end gap-2 px-3 pb-7">
        <MessageProfile />
        <div className="w-[30%]">
          <img
            src="/neymar.jpg"
            className="w-full cursor-pointer rounded-md object-contain"
            alt=""
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 px-3 pb-7">
        <div className="w-[30%]">
          <img
            src="/neymar.jpg"
            className="w-full cursor-pointer rounded-md object-contain"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default FileMessage;
