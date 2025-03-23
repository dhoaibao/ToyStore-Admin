import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import ConversationSideBar from "../components/chat/ConversationSideBar";
import ChatArea from "../components/chat/ChatArea";
import { messageService } from "../services";
import { message } from "antd";

const Chat = () => {
  const { userId } = useSelector((state) => state.user);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const result = await messageService.getConversations(
          `page=${page}&limit=20`,
        );
        setConversations(result.data);
        setHasMore(result.pagination.page < result.pagination.totalPages);
      } catch (error) {
        console.log("Failed to fetch conversations: ", error);
        message.error("Xảy ra lỗi khi tải danh sách trò chuyện!");
      }
      setLoading(false);
    };

    if (hasMore) {
      fetchConversations();
    }
  }, [hasMore, page]);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io("http://localhost:3000", {
      query: { userId: userId.toString() },
    });
    socketRef.current = newSocket;

    newSocket.emit("joinRoom", userId);

    newSocket.on("newMessage", (data) => {
      setConversations((prev) => {
        const index = prev.findIndex(
          (item) => item.sender.senderId === data.senderId,
        );
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            lastMessage: {
              content: data.content || "",
              time: data.time,
              isRead: false,
            },
            unreadCount: updated[index].unreadCount + 1,
          };
          return updated;
        }
        return prev;
      });
      handleNotification(data);
    });

    return () => {
      newSocket.off("newMessage");
      newSocket.disconnect();
    };
  }, [userId]);

  const handleNotification = (data) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Toy Store", {
        body: data.content || "Hình ảnh",
      });
    } else if (
      "Notification" in window &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Toy Store", {
            body: data.content,
          });
        }
      });
    }
  };

  return (
    <div className="flex h-full bg-gray-100">
      <ConversationSideBar
        conversations={conversations}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        loading={loading}
        setPage={setPage}
      />
      <ChatArea
        selectedConversation={selectedConversation}
        socket={socketRef.current}
        setConversations={setConversations}
      />
    </div>
  );
};

export default Chat;
