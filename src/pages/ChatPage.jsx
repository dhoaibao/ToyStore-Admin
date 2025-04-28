import { useState } from "react";
import ConversationSideBar from "../components/chat/ConversationSideBar";
import ChatArea from "../components/chat/ChatArea";

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMess, setNewMess] = useState(null);

  return (
    <div className="flex h-full bg-gray-100">
      <ConversationSideBar
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        newMess={newMess}
      />
      <ChatArea
        selectedConversation={selectedConversation}
        setNewMess={setNewMess}
      />
    </div>
  );
};

export default ChatPage;
