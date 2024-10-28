import Posts from "@/components/home/Posts";
import Sidebar from "@/components/common/Sidebar";
import Stories from "@/components/home/Stories";

const Home = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"home"} />
      <div className="w-full flex flex-col overflow-auto">
        <Stories />
        <Posts />
      </div>
    </div>
  );
};

export default Home;
