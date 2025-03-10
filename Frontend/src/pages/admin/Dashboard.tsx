import Sidebar from "@/components/admin/common/Sidebar";
import DashboardDetials from "@/components/admin/dashboard/DashboardDetials";

const Dashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={"dashboard"} />
      <div className="w-full flex flex-col overflow-auto scrollbar-hidden">
        <DashboardDetials />
      </div>
    </div>
  );
};

export default Dashboard;
