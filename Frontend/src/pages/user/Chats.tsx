import ChatInbox from "@/components/chats/ChatInbox";
import Sidebar from "@/components/common/Sidebar";

const Chats = () => {
  return (
    <div className="flex h-screen">
      <Sidebar page={"chat"} />
      <ChatInbox />
    </div>
  );
};

export default Chats;
