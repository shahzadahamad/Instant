import Sidebar from "./Sidebar";
import Stories from "./Stories";

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Stories />
    </div>
  );
};

export default Home;
