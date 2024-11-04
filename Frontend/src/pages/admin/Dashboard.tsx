import Header from "@/components/admin/common/Header";
import Sidebar from "@/components/admin/common/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"dashboard"} />
      <div className="w-full flex flex-col overflow-auto">
        <Header title={"Dashboard"} />
      </div>
    </div>
  );
};

export default Dashboard;
