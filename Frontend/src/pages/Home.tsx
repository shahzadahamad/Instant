import Posts from "../components/home/Posts";
import Sidebar from "../components/home/Sidebar";
import Stories from "../components/home/Stories";

const Home = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col overflow-auto">
        <Stories />
        <Posts />
      </div>
    </div>
  );
};

export default Home;
