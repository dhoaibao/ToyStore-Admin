import { useEffect, useState } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { SocketContext } from "./SocketContext";

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL;

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userId } = useSelector((state) => state.user);

  useEffect(() => {
    if (userId) {
      const socketIo = io(SOCKET_URL, {
        query: { userId: userId.toString() },
      });

      setSocket(socketIo);

      return () => {
        socketIo.disconnect();
      };
    }
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SocketProvider;
