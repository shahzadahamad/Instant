import Header from "@/components/admin/common/Header";
import Sidebar from "@/components/admin/common/Sidebar";
import MusicDetialsTable from "@/components/admin/music/MusicDetialsTable";

const Music = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="w-full flex flex-col overflow-auto">
        <Header title={"Music"} />
        <MusicDetialsTable />
      </div>
    </div>
  );
};

export default Music;
