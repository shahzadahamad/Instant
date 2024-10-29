import ChatInboxDetials from "@/components/chats/ChatInboxDetials";
import Sidebar from "@/components/common/Sidebar";

const ChatInbox = () => {
  return (
    <div className="flex h-screen">
      <Sidebar page={"chat"} />
      <ChatInboxDetials />
    </div>
  );
};

export default ChatInbox;
