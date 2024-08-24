const ProfilePostSection = () => {
  const defaultArray = Array.from({ length: 10 }, (_, index) =>
    (index + 1).toString()
  );

  return (
    <div className="w-full">
      <div className=" text-white font-bold flex gap-5 text-[20px] p-4 items-center justify-center">
        <h1>Posts</h1>
        <h1 className="text-[#363636]">Saved</h1>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-2 px-[82px]">
        {defaultArray.map((item, index) => {
          return (
            <div key={index}>
              <img src="./free.jpg" alt="" className="rounded w-80" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfilePostSection;
