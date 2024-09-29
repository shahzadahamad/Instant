interface MyComponentProps {
  title: string;
}

const Header: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <header className="text-white font-bold flex items-center gap-10 ps-10 h-[12vh] border-b border-[#363636]">
      <h1 className="cursor-pointer">{title}</h1>
    </header>
  );
};

export default Header;
