const ProfileDetials = () => {
  return (
    <div className="flex flex-col h-1/2 border-b border-[#363636]">
      <div className="flex items-center gap-8 pt-10 pb-8 px-28">
        <img src="./avatar.png" alt="avatar" className="w-28 h-auto" />
        <div className="flex flex-col gap-3 font-bold text-white">
          <div className="flex gap-5">
            <h1 className="text-3xl font-extrabold">inexposable</h1>
            <button className="px-4 font-bold text-white bg-[#363636] rounded-[10px] cursor-pointer">
              Edit Profile
            </button>
          </div>
          <div className="flex gap-5 cursor-pointer">
            <p>4 posts</p>
            <p>392 followers</p>
            <p>401 following</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 ps-[115px]">
        <h1 className="font-bold text-white">Shahzad Ahamad P</h1>
        <p className="text-white">&gt; Software Developer (MERN)</p>
      </div>
    </div>
  );
};

export default ProfileDetials;
