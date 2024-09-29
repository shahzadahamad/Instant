import Header from "@/components/admin/common/Header";
import Sidebar from "@/components/admin/common/Sidebar";
import UserDetialsTable from "@/components/admin/users/UserDetialsTable";

const Users = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="w-full flex flex-col overflow-auto">
        <Header title={'Users'} />
        <UserDetialsTable />
      </div>
    </div>
  );
};

export default Users;
