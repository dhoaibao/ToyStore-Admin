import { List, Avatar } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { generateAvatar } from "../../utils";
import { useSelector } from "react-redux";

const ConversationSideBar = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
  setPage,
  loading
}) => {
  const { userId } = useSelector(state => state.user);
  
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
                        item.sender.sender.email,
                        item.sender.sender.fullName,
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
                  <div
                    className={`flex justify-between items-center ${!item.lastMessage.isRead && item.sender.senderId !== userId ? "font-semibold" : ""}`}
                  >
                    <span>{item.sender.sender.fullName}</span>
                    <span className="text-gray-500 text-xs">
                      {dayjs(item.lastMessage.time).fromNow()}
                    </span>
                  </div>
                }
                description={
                  <span className="flex justify-between">
                    <span>{item.lastMessage.content || "Hình ảnh"}</span>
                    {!item.lastMessage.isRead &&
                      item.sender.senderId !== userId && (
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
  conversations: PropTypes.array.isRequired,
  selectedConversation: PropTypes.number,
  setSelectedConversation: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default ConversationSideBar;
