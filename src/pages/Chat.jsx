import { useState, useEffect, useRef } from "react";
import { Avatar, List, Input, Button, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Check, CheckCheck } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { Send } from "lucide-react";
import { messageService } from "../services";
import { generateAvatar } from "../utils";
import { useLocation } from "react-router-dom";

const { Text } = Typography;

const Chat = () => {
  const [conversations, setConversations] = useState([]);

  const { userId } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const [showScrollIcon, setShowScrollIcon] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    messageService.getConversations().then((result) => {
      setConversations(result.data);
    });
  }, []);

  useEffect(() => {
    if (userId) {
      const newSocket = io("http://localhost:3000", {
        query: { userId: userId.toString() },
      });

      socketRef.current = newSocket;

      newSocket.emit("joinRoom", userId);

      newSocket.on("updateStatus", (senderId) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === senderId && !msg.isRead
              ? { ...msg, isRead: true }
              : msg
          )
        );
      });

      newSocket.on("newMessage", (data) => {
        const updatedConversations = conversations.map((item) =>
          item.sender.senderId === data.senderId
            ? {
                ...item,
                lastMessage: {
                  content: data.content,
                  time: data.time,
                  isRead: false,
                },
              }
            : item
        );

        if (
          !conversations.find((item) => item.sender.senderId === data.senderId)
        ) {
          updatedConversations.push({
            sender: {
              senderId: data.senderId,
              sender: {
                fullName: data.fullName,
              },
            },
            lastMessage: {
              content: data.content,
              time: data.time,
              isRead: false,
            },
          });
        }
        setConversations(updatedConversations);
        if (data.senderId === selectedConversation) {
          setMessages((prev) => [
            ...prev,
            {
              ...data,
              time: moment(data.time).format("HH:mm"),
            },
          ]);
          if (path === "/chats") {
            newSocket.emit("markAsRead", {
              senderId: data.senderId,
              receiverId: null,
            });
          }
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.off("newMessage");
          socketRef.current.off("updateStatus");
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [userId, path, selectedConversation, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      console.log(selectedConversation);
      messageService.getMessages(selectedConversation).then((result) => {
        setMessages(
          result.data.map((msg) => ({
            ...msg,
            time: moment(msg.time).format("HH:mm"),
          }))
        );
        socketRef.current.emit("markAsRead", {
          senderId: selectedConversation,
          receiverId: null,
        });
      });
    }
  }, [selectedConversation]);

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

  const sendMessage = (senderId) => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      senderId: userId,
      receiverId: senderId,
      content: newMessage,
      time: new Date(),
    };
    socketRef.current.emit("replyMessage", newMsg);
    setMessages([
      ...messages,
      {
        ...newMsg,
        time: moment(newMsg.time).format("HH:mm"),
      },
    ]);
    setNewMessage("");
    setConversations((prev) => {
      const updatedConversations = prev.map((item) =>
        item.sender.senderId === senderId
          ? {
              ...item,
              lastMessage: {
                content: newMessage,
                time: new Date(),
                isRead: true,
              },
            }
          : item
      );
      return updatedConversations;
    });
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
                          item.sender.sender.email,
                          item.sender.sender.fullName
                        );
                        return (
                          <Avatar
                            src={item.sender.sender.avatar?.url}
                            alt={item.sender.sender.fullName || "User"}
                            size={40}
                            style={{
                              backgroundColor: item.sender.sender.avatar?.url
                                ? "transparent"
                                : color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 16,
                            }}
                          >
                            {!item.sender.sender.avatar?.url && initial}
                          </Avatar>
                        );
                      })()}
                    </div>
                  }
                  title={
                    <div className="flex justify-between items-center">
                      <span>{item.sender.sender.fullName}</span>
                      <span className="text-gray-500 text-xs">
                        {moment(item.lastMessage.time).format("HH:mm")}
                      </span>
                    </div>
                  }
                  description={item.lastMessage.content}
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
                    message.senderId !== selectedConversation
                      ? "flex-end"
                      : "flex-start",
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
                      message.senderId !== selectedConversation
                        ? "#e6f7ff"
                        : "#ffffff",
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Text>{message.content}</Text>
                  <br />
                  <Text
                    type="secondary"
                    className="flex items-center space-x-1 text-xs"
                  >
                    <span>{message.time}</span>
                    {message.senderId !== selectedConversation && (
                      <span>
                        {message.isRead ? (
                          <CheckCheck strokeWidth={1} size={16} />
                        ) : (
                          <Check strokeWidth={1} size={16} />
                        )}
                      </span>
                    )}
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
              onPressEnter={() => sendMessage(selectedConversation)}
              className="flex-1 mr-2"
            />
            <Button
              type="primary"
              onClick={() => sendMessage(selectedConversation)}
            >
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
