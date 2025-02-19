const ProfileHeaders: React.FC<{ name: string }> = ({ name }) => {
  return (
    <header className="font-bold flex items-center gap-10 ps-10 h-[12%] border-b border-[#363636]">
      <h1 className="underline underline-offset-8 cursor-pointer">
        {name}
      </h1>
    </header>
  );
};

export default ProfileHeaders;
