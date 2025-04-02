import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { messageService } from "../../services";
import {
  List,
  Input,
  Button,
  Typography,
  Image,
  message,
  Upload,
  Spin,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Send, ImageUp } from "lucide-react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const { Text } = Typography;

const ChatArea = ({ selectedConversation, socket, setConversations }) => {
  const { userId, user } = useSelector((state) => state.user);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showScrollIcon, setShowScrollIcon] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (!selectedConversation && !userId && !socket) return;

    socket.emit("markAsRead", {
      senderId: selectedConversation,
      receiverId: null,
    });

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const result = await messageService.getMessages(
          selectedConversation,
          `page=${page}&limit=20`,
        );
        if (result && result.pagination) {
          setPage(result.pagination.page);
          setHasMore(result.pagination.page < result.pagination.totalPages);
          setMessages((prev) => [...result.data, ...prev]);
          setConversations((prevConversations) =>
            prevConversations.map((conversation) =>
              conversation.sender.senderId === selectedConversation &&
              conversation.sender.senderId !== userId
                ? {
                    ...conversation,
                    lastMessage: {
                      ...conversation.lastMessage,
                      isRead: true,
                    },
                  }
                : conversation,
            ),
          );
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        message.error("Không thể tải tin nhắn!");
      }
    };

    fetchMessages();
  }, [selectedConversation, page]);

  useEffect(() => {
    if (!socket) return;

    // Update message read status
    socket.on("updateStatus", (senderId) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === senderId && !msg.isRead
            ? { ...msg, isRead: true }
            : msg,
        ),
      );
    });

    // Handle new incoming messages
    socket.on("newMessage", (data) => {
      if (path === "/chats") {
        setMessages((prev) => [...prev, { ...data }]);
        socket.emit("markAsRead", {
          senderId: data.senderId,
          receiverId: userId,
        });
      }
    });

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("updateStatus");
      socket.off("newMessage");
    };
  }, [socket, userId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && page === 1) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollIcon(false);
    }
  }, [messages, page]);

  // Handle scroll events to show/hide scroll button and load more messages
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;

      // Show/hide scroll to bottom button based on scroll position
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowScrollIcon(!isAtBottom);

      // Load more messages when scrolled to top
      const isAtTop = scrollTop <= 10;
      if (isAtTop && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    }
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollIcon(false);
    }
  };
  const sendMessage = (senderId) => {
    // Don't send if message is empty and no files or socket not available
    if ((!newMessage.trim() && fileList.length === 0) || !socket) return;

    // Create new message object
    const newMsg = {
      senderId: userId,
      receiverId: senderId,
      content: newMessage,
      time: new Date(),
      senderName: user.fullName,
      avatar: user.avatar,
      files: fileList.map((file) => ({
        originName: file.originFileObj.name,
        mimetype: file.originFileObj.type,
        buffer: file.originFileObj,
      })),
    };

    socket.emit("replyMessage", newMsg);

    setMessages([
      ...messages,
      {
        ...newMsg,
        uploadImages: fileList.map((file) => ({
          url: URL.createObjectURL(file.originFileObj),
        })),
      },
    ]);

    // Reset input fields
    setNewMessage("");
    setFileList([]);
    scrollToBottom();

    setConversations((prev) => {
      const updatedConversations = prev.map((item) =>
        item.sender.senderId === senderId
          ? {
              ...item,
              lastMessage: {
                content: newMsg.content,
                time: newMsg.time,
                isRead: true,
              },
            }
          : item,
      );
      return updatedConversations;
    });
  };

  // Handle file upload changes
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Handle removing files from the upload list
  const handleRemove = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid),
    );
  };

  return (
    <div className="w-2/3 flex flex-col">
      {/* Chat Messages Area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 bg-gray-100"
      >
        <List
          dataSource={messages}
          renderItem={(message, index) => {
            const previousMessage = messages[index - 1];
            const showDateHeader =
              !previousMessage ||
              dayjs(message.time).format("DD/MM/YYYY") !==
                dayjs(previousMessage.time).format("DD/MM/YYYY");
            return (
              <>
                {showDateHeader && (
                  <div className="text-center sticky top-0 z-50 m-2 text-xs flex justify-center">
                    {loading ? (
                      <Spin size="small" />
                    ) : (
                      <span className="bg-gray-300 w-32 rounded-lg p-1 ">
                        {dayjs(message.time).format("DD/MM/YYYY") ===
                        dayjs().format("DD/MM/YYYY")
                          ? "Hôm nay"
                          : dayjs(message.time).format("DD/MM/YYYY")}
                      </span>
                    )}
                  </div>
                )}
                {/* show images */}
                <div
                  className={`flex mb-2 ${
                    message.senderId !== selectedConversation
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.uploadImages && message.uploadImages.length > 0 && (
                    <div
                      className={`max-w-[70%] flex flex-wrap ${message.senderId !== selectedConversation ? "justify-end" : "justify-start"}`}
                    >
                      {message.uploadImages.map((image, idx) => (
                        <Image
                          key={idx}
                          src={image.url}
                          className="rounded-lg mb-2 flex-col"
                          width={100}
                          preview={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {/* show content messages */}
                {message.content && (
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
                        <span>{dayjs(message.time).format("HH:mm")}</span>
                      </Text>
                    </div>
                  </div>
                )}
                {/* status */}
                <span className="flex justify-end">
                  {index + 1 === messages.length &&
                    message.senderId === userId && (
                      <Text className="text-gray-600 text-xs">
                        {message.isRead ? "Đã xem" : "Đã gửi"}
                      </Text>
                    )}
                </span>
              </>
            );
          }}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Always at Bottom */}
      <div className="p-2 bg-white border-t border-gray-200">
        <div>
          {fileList.length > 0 && (
            <Upload
              fileList={fileList}
              listType="picture-card"
              onRemove={handleRemove}
            />
          )}
          <div className="flex items-center justify-center space-x-2 p-2">
            <Upload
              beforeUpload={(file) => {
                // Check if file with same name already exists in fileList
                const isDuplicate = fileList.some(
                  (item) => item.originFileObj.name === file.name,
                );
                if (isDuplicate) {
                  message.warning("Hình ảnh này đã được chọn");
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
              showUploadList={false}
              multiple
              fileList={fileList}
              accept="image/*"
              maxCount={5}
              onChange={handleUploadChange}
            >
              <Button type="text" className="p-0">
                <ImageUp strokeWidth={1} size={26} />
              </Button>
            </Upload>
            <Input
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={() => sendMessage(selectedConversation)}
            />
            <Button type="primary" onClick={() => sendMessage(selectedConversation)} className="px-3">
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

ChatArea.propTypes = {
  selectedConversation: PropTypes.number,
  socket: PropTypes.any,
  setConversations: PropTypes.func.isRequired,
};

export default ChatArea;
