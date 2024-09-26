import Sidebar from "@/components/admin/common/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="w-full flex flex-col overflow-auto">
      </div>
    </div>
  );
};

export default Dashboard;
