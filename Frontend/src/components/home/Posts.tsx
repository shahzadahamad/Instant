import PostLowerSection from "./PostLowerSection";

const Posts = () => {
  const defaultArray = Array.from({ length: 5 }, (_, index) =>
    (index + 1).toString()
  );

  return (
    <div className="w-[89vw] h-[80vh] overflow-auto scrollbar-hidden">
      <div className="flex flex-col items-center justify-start gap-4 p-4">
        {defaultArray.map((item, index) => (
          <div
            key={index}
            className="w-[500px] flex items-center flex-col justify-center rounded-xl-lg "
          >
            <div className="w-full">
              <div className="px-1 py-3 rounded flex gap-3 items-center">
                <div className="relative flex-shrink-0 w-[50px] h-[50px]">
                  <div className="p-[2.5px] bg-gradient-to-r from-[#b5347c] via-[#eb1c25] to-[#fdcd23] rounded-full relative">
                    <div className="w-full h-full rounded-full border-[1.5px] border-black overflow-hidden">
                      <img
                        src="./avatar.png"
                        alt="avatar"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-white font-bold">neymarjr</h2>
                  <p className="text-[#3B3B3B] font-bold text-[12px]">2 d</p>
                </div>
                <div className="ml-auto p-0">
                  <h1 className="text-white -mt-[20px] text-4xl leading-none">
                    ...
                  </h1>
                </div>
              </div>
              <div className="bg-blue-800 rounded border-[.9px] border-[#797777]">
                <img src="./post.jpg" alt="post" className="rounded" />
              </div>
              <PostLowerSection postId={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
