import { useState, useEffect, useRef } from "react";
import { Avatar, List, Input, Button, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import moment from "moment";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { Send } from "lucide-react";

const { Text } = Typography;

const Chat = () => {
  const conversations = [
    { id: 1, name: "Nguyễn Văn A", time: "10:00 AM", content: "Hello" },
    { id: 2, name: "Nguyễn Văn A", time: "10:00 AM", content: "Hello" },
    { id: 3, name: "Nguyễn Văn A", time: "10:00 AM", content: "Hello" },
    { id: 4, name: "Nguyễn Văn A", time: "10:00 AM", content: "Hello" },
    { id: 5, name: "Nguyễn Văn A", time: "10:00 AM", content: "Hello" },
    { id: 6, name: "Nguyễn Văn A", time: "10:00 AM", content: "Hello" },
    { id: 3, name: "Nguyễn Văn A", time: "10:00 AM", content: "Hello" },
    { id: 4, name: "Nguyễn Văn A", time: "10:00 AM", content: "Hello" },
    { id: 5, name: "Nguyễn Văn A", time: "10:00 AM", content: "Hello" },
    { id: 6, name: "Nguyễn Văn A", time: "10:00 AM", content: "Hello" },
  ];

  const { userId } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [showScrollIcon, setShowScrollIcon] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

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
            time: moment(data.time).format("HH:mm"),
          },
        ]);
      });

      return () => {
        newSocket.off("newMessage");
        newSocket.disconnect();
      };
    }
  }, [userId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollIcon(false);
    }
  }, [messages]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowScrollIcon(!isAtBottom);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollIcon(false);
    }
  };

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
    <div className="flex h-full bg-gray-100">
      {/* Sidebar - Danh sách tin nhắn */}
      <div className="w-1/3 border-r border-gray-200 bg-white p-4">
        <h2 className="text-xl font-bold mb-4">Tin nhắn</h2>
        <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
          <List
            dataSource={conversations}
            renderItem={(item) => (
              <List.Item
                className="hover:bg-gray-100 cursor-pointer"
                style={{ padding: "8px" }}
              >
                <List.Item.Meta
                  avatar={<Avatar src="https://via.placeholder.com/40" />}
                  title={
                    <div className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="text-gray-500 text-sm">{item.time}</span>
                    </div>
                  }
                  description={item.content}
                />
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col">
        {/* Chat Messages Area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 bg-gray-100"
        >
          <List
            dataSource={messages}
            renderItem={(message) => (
              <div
                style={{
                  justifyContent:
                    message.senderId === userId ? "flex-end" : "flex-start",
                  display: "flex",
                  marginBottom: "10px",
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
                  <Text>{message.content}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {message.time}
                  </Text>
                </div>
              </div>
            )}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Always at Bottom */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <Input
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={sendMessage}
              className="flex-1 mr-2"
            />
            <Button type="primary" onClick={sendMessage}>
              <Send strokeWidth={1} size={18} />
            </Button>
          </div>
        </div>
      </div>

      {showScrollIcon && (
        <Button
          shape="circle"
          icon={<DownOutlined />}
          onClick={scrollToBottom}
          className="fixed bottom-20 right-4 z-10"
        />
      )}
    </div>
  );
};

export default Chat;
