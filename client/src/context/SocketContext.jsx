import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AppContext";

const socketContext = createContext();

// Hook to use the socket context
export const useSocketContext = () => {
  return useContext(socketContext);
};

// Provider for Socket Context
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const socket = io(backendUrl, {
      query: {
        userId: user._id,
      },
    });
    setSocket(socket);

    // Listen for online users
    socket.on("getOnlineUsers", (users) => {
      // console.log("Users: ", users)
      setOnlineUsers(() => users);
    });

    // Cleanup on unmount or dependency change
    return () => {
      socket.off("getOnlineUsers");
      socket.close();
    };
  }, [user]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
