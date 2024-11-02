import React from "react";

const EmojiReaction: React.FC<{ value: boolean }> = ({ value }) => {
  return (
    <>
      {value ? (
        <span className="cursor-pointer absolute bottom-2 border-2 dark:border-[#09090b] border-white left-14 mb-2 mr-2 px-2 py-0.5 text-xs dark:bg-[#262626] bg-[#efefef] rounded-xl">
          😊
        </span>
      ) : (
        <span className="cursor-pointer absolute bottom-2 border-2 dark:border-[#09090b] border-white right-3 mb-2 mr-2 px-2 py-0.5 text-xs dark:bg-[#262626] bg-[#efefef] rounded-xl">
          😊
        </span>
      )}
    </>
  );
};

export default EmojiReaction;
