import Sidebar from "@/components/admin/common/Sidebar";
import UserDetialsTable from "@/components/admin/users/UserDetialsTable";
import UsersHeader from "@/components/admin/users/UsersHeader";

const Users = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="w-full flex flex-col overflow-auto">
        <UsersHeader />
        <UserDetialsTable />
      </div>
    </div>
  );
};

export default Users;
