import { createContext, useContext } from "react";

const SocketContext = createContext(null);

const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketContext, useSocket };