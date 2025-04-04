import { List, Avatar, message } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { generateAvatar } from "../../utils";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { messageService } from "../../services";
import { useSocket } from "../../context/SocketContext";

const ConversationSideBar = ({
  selectedConversation,
  setSelectedConversation,
}) => {
  const { userId } = useSelector((state) => state.user);
  const socket = useSocket();

  const [conversations, setConversations] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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
    if (!socket) return;

    socket.emit("joinRoom", userId);

    socket.on("newMessage", (data) => {
      setConversations((prev) => {
        const index = prev.findIndex((item) => item.sender.senderId === data.senderId);
        const lastMessage = {
          content: data.content || "",
          time: data.time,
          isRead: false,
        };

        // Create a copy of the conversations array
        const updated = [...prev];

        if (index !== -1) {
          // Update existing conversation
          const conversationWithNewMessage = updated.splice(index, 1)[0];
          updated.unshift({
            ...conversationWithNewMessage,
            lastMessage,
            unreadCount: conversationWithNewMessage.unreadCount + 1,
          });
        } else {
          // Add new conversation
          updated.unshift({
            sender: {
              senderId: data.senderId,
              fullName: data.senderName,
              email: data.email,
              avatar: data.avatar,
            },
            lastMessage,
            unreadCount: 1,
          });
        }

        return updated;
      });

      handleNotification(data);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, userId]);

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
    <div className="w-1/3 border-r border-gray-200 bg-white p-4">
      <h2 className="text-xl font-bold mb-4">Tin nhắn</h2>
      <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
        <List
          dataSource={conversations}
          renderItem={(item) => (
            <List.Item
              onClick={() => setSelectedConversation(item.sender.senderId)}
              key={item.sender.senderId}
              className={`hover:bg-gray-100 mb-1 cursor-pointer rounded-md ${
                selectedConversation === item.sender.senderId && "bg-blue-100"
              }`}
              style={{ padding: "8px" }}
            >
              <List.Item.Meta
                avatar={
                  <div className="flex justify-center items-center">
                    {(() => {
                      const { color, initial } = generateAvatar(
                        item.sender.email,
                        item.sender.fullName,
                      );
                      return (
                        <Avatar
                          src={item.sender.avatar?.url}
                          alt={item.sender.fullName || "User"}
                          size={40}
                          style={{
                            backgroundColor: item.sender.avatar?.url
                              ? "transparent"
                              : color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                          }}
                        >
                          {!item.sender.avatar?.url && initial}
                        </Avatar>
                      );
                    })()}
                  </div>
                }
                title={
                  <div
                    className={`flex justify-between items-center ${!item.lastMessage.isRead && item.senderId !== userId ? "font-semibold" : ""}`}
                  >
                    <span>{item.sender.fullName}</span>
                    <span className="text-gray-500 text-xs">
                      {dayjs(item.lastMessage.time).fromNow()}
                    </span>
                  </div>
                }
                description={
                  <span className="flex justify-between">
                    <span>{item.lastMessage.content || "Hình ảnh"}</span>
                    {!item.lastMessage.isRead && item.senderId !== userId && (
                      <span className="bg-red-600 rounded-full text-xs text-white w-5 h-5 flex items-center justify-center">
                        {item.unreadCount}
                      </span>
                    )}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

ConversationSideBar.propTypes = {
  selectedConversation: PropTypes.number,
  setSelectedConversation: PropTypes.func.isRequired,
};

export default ConversationSideBar;
