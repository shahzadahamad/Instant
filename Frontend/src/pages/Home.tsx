import Sidebar from '../components/home/Sidebar';
import Stories from '../components/home/Stories'

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Stories />
    </div>
  );
};

export default Home;
