import MessageProfile from "../MessageProfile";
import EmojiReaction from "./EmojiReaction";
import MessageMenu from "./MessageMenu";

const TextMessage = () => {
  return (
    <>
      <div className="relative flex group items-center gap-2 px-3 pb-7">
        <MessageProfile />
        <div className="max-w-[70%] dark:bg-[#262626] break-words bg-[#efefef] px-3 py-2 rounded-2xl">
          <h1>
            dsfjasldfjdsf jasldfjdsfjasldfjdsfjasldfjdsfjasldg
            fjdsfjasldfjdsfjasldfjdsfjasldfjdsf fjasldfjdsfjasldfjdsfja
            jsldkfjaslkd fklj skldafj
          </h1>
        </div>
        <EmojiReaction value={true} />
        <MessageMenu value={true} />
      </div>

      <div className="relative flex group items-center justify-end gap-3 px-3 pb-7">
        <MessageMenu value={false} />
        <div className="max-w-[70%] bg-[#0084ff] text-white break-words px-3 py-2 rounded-2xl">
          <h1>
            dsfjasldfjdsf jasldfjdsfjasldfjdsfjasldfjdsfjasldg
            fjdsfjasldfjdsfjasldfjdsfjasldfjdsf fjasldfjdsfjasldfjdsfja
            jsldkfjaslkd fklj skldafj
          </h1>
        </div>
        <EmojiReaction value={false} />
      </div>
    </>
  );
};

export default TextMessage;
