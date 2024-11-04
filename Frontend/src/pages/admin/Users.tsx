import Header from "@/components/admin/common/Header";
import Sidebar from "@/components/admin/common/Sidebar";
import UserDetialsTable from "@/components/admin/users/UserDetialsTable";

const Users = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={'users'} />
      <div className="w-full h-full flex flex-col overflow-auto scrollbar-hidden">
        <Header title={'Users'} />
        <UserDetialsTable />
      </div>
    </div>
  );
};

export default Users;
