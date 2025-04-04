import { useState } from "react";
import ConversationSideBar from "../components/chat/ConversationSideBar";
import ChatArea from "../components/chat/ChatArea";

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="flex h-full bg-gray-100">
      <ConversationSideBar
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
      />
      <ChatArea
        selectedConversation={selectedConversation}
      />
    </div>
  );
};

export default ChatPage;
