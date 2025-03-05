import { useState, useEffect } from "react";
import { Input, Button, List, Typography, Tabs } from "antd";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import moment from "moment";

const { Text } = Typography;

const conversations = [
  {
    fullName: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/300",
    message: "Hello",
    time: "10:00 AM",
  },
  {
    fullName: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/300",
    message: "Hello",
    time: "10:00 AM",
  },
];
const Chat = () => {
  const { userId } = useSelector((state) => state.user.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (userId) {
      const newSocket = io("http://localhost:3000", {
        query: { userId: userId.toString() },
      });

      setSocket(newSocket);

      newSocket.emit("joinRoom", userId);

      newSocket.on("newMessage", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            time: moment(data.createdAt).format("HH:mm"),
          },
        ]);
      });

      return () => {
        newSocket.off("newMessage");
        newSocket.disconnect();
      };
    }
  }, [userId]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      senderId: userId,
      receiverId: 2,
      content: newMessage,
      time: new Date(),
    };
    socket.emit("replyMessage", newMsg);
    setMessages([
      ...messages,
      {
        ...newMsg,
        time: moment(newMsg.time).format("HH:mm"),
      },
    ]);
    setNewMessage("");
  };
  return (
    <div className="mx-auto p-4">
      <div className="items-center mb-4">
        <p className="text-2xl font-bold">Chats</p>
      </div>
      <Tabs
        className="w-full"
        tabPosition="left"
        items={conversations.map((item, i) => {
          const id = String(i + 1);
          return {
            label: (
              <div className="flex p-2 items-center space-x-2">
                <img
                  src={item.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <div className="flex items-center space-x-6 justify-between">
                    <p className="font-semibold">{item.fullName}</p>
                    <p className="text-xs">{item.time}</p>
                  </div>
                  <p className="text-sm">{item.message}</p>
                </div>
              </div>
            ),
            key: id,
            children: (
              <div>
                <List
                  dataSource={messages}
                  renderItem={(message) => (
                    <div
                      style={{
                        justifyContent:
                          message.senderId === userId ? "flex-end" : "flex-start",
                        display: "flex",
                        marginBottom: "10px", // Tạo khoảng cách giữa các tin nhắn
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "70%",
                          padding: "10px",
                          borderRadius: "10px",
                          backgroundColor:
                            message.senderId === userId ? "#e6f7ff" : "#ffffff",
                          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Text strong>{message.senderId === userId ? "Bạn" : item.fullName}</Text>
                        <br />
                        <Text>{message.content}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {message.time}
                        </Text>
                      </div>
                    </div>
                  )}
                />
                <div style={{ display: "flex", padding: "10px" }}>
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onPressEnter={sendMessage}
                    style={{ marginRight: "10px", flex: 1 }}
                  />
                  <Button type="primary" onClick={sendMessage}>
                    Gửi
                  </Button>
                </div>
              </div>
            ),
          };
        })}
      />
    </div>
  );
};
export default Chat;
