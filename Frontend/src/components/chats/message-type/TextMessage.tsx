import MessageProfile from "../MessageProfile";

const TextMessage = () => {
  return (
    <>
      <div className="flex items-end gap-2 px-3 pb-7">
        <MessageProfile />
        <div className="max-w-[70%] dark:bg-[#262626] break-words bg-[#efefef] px-3 py-2 rounded-md">
          <h1>
            dsfjasldfjdsf jasldfjdsfjasldfjdsfjasldfjdsfjasldg
            fjdsfjasldfjdsfjasldfjdsfjasldfjdsf fjasldfjdsfjasldfjdsfja
            jsldkfjaslkd fklj skldafj
          </h1>
        </div>
      </div>

      <div className="flex justify-end gap-3 px-3 pb-7">
        <div className="max-w-[70%] bg-[#3797f0] text-white break-words px-3 py-2 rounded-md">
          <h1>
            dsfjasldfjdsf jasldfjdsfjasldfjdsfjasldfjdsfjasldg
            fjdsfjasldfjdsfjasldfjdsfjasldfjdsf fjasldfjdsfjasldfjdsfja
            jsldkfjaslkd fklj skldafj
          </h1>
        </div>
      </div>
    </>
  );
};

export default TextMessage;
