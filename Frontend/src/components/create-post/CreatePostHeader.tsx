const CreatePostHeader: React.FC<{ headline: string }> = ({ headline }) => {
  return (
    <header className="font-bold flex items-center ps-10 h-[12vh] border-b border-[#363636]">
      <h1 className="cursor-pointer">{headline}</h1>
    </header>
  );
};

export default CreatePostHeader;
