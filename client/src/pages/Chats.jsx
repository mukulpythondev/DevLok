import { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { AppContext } from "../context/AppContext";

import {io} from "socket.io-client"
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const socket=  io("http://localhost:8000")
const Chats = () => {
  const { user } = useContext(AppContext); // Access logged-in user from context
  const [favourites, setFavourites] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch favourites once the user is available
  const getFavourites = async () => {
    if (user) {
      try {
        const { data } = await axiosInstance.get("users/getfavourite");
        setFavourites(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favourites:", error);
        setLoading(false);
      }
    }
  };
  // Fetch user and favourites on component mount
  useEffect(() => {
    getFavourites();
  }, [user]);

  // Set up socket event listeners
  useEffect(() => {
    const onConnect = () => console.log("Connected to:", socket.id);
    const onDisconnect = () => console.log("Disconnected from:", socket.id);

    const onReceiveMessage = (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, senderEmail: message.senderEmail || user.email },
      ]);
    };

    const onRecipientOffline = (recipientEmail) =>
      toast.error(`${recipientEmail} is offline`);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-message", onReceiveMessage);
    socket.on("recipient-offline", onRecipientOffline);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive-message", onReceiveMessage);
      socket.off("recipient-offline", onRecipientOffline);
    };
  }, [socket, user?.email]);

  // Send message handler
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return; // Don't allow sending empty messages

    socket.emit("send-message", {
      senderEmail: user.email,
      recipientEmail,
      message: inputMessage,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { message: inputMessage, senderEmail: user.email },
    ]);

    setInputMessage("");
  };

  // Initiate chat with a specific friend
  const initiateChat = (email,name) => {
    setRecipientEmail(email);
    toast.success("Chatting with " + name);
    socket.emit("initiate-chat", {
      senderEmail: user.email,
      recipientEmail: email,
    });
  };

  // Conditional rendering for loading state
  if (loading) {
    return  <Loader/>;
  }

  return (
    <div className="bg-black-100 text-rose-300 h-screen pt-32 pb-40 w-full flex">
    {/* Friends list */}
    <div className="w-1/4 bg-black-100 border-pink-400 border-[1px] p-4 overflow-y-auto">
        <h2 className="text-lg mb-4">Chats</h2>
        <ul>
          {favourites?.data?.map((friend) => (
            <li
              key={friend._id}
              onClick={() => initiateChat(friend.email, friend.name)}
              className={`mb-2 p-2 cursor-pointer flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded ${
                recipientEmail === friend.email && "bg-black-100"
              }`}
            >
              <img
                src={friend.profile}
                alt={friend.name}
                className="w-8 h-8 rounded-full"
              />
              <span>{friend.name}</span>
            </li>
          ))}
        </ul>
      </div>

    {/* Chat screen */}
    <div className="w-3/4 bg-gray-800 flex flex-col">
        {recipientEmail ? (
          <>
            {/* Top: Selected Contact Info */}
            <div className="p-4 bg-black-100 border-[1px] border-pink-400 flex items-center space-x-4">
              
              <h2 className="text-lg">{recipientEmail}</h2>
            </div>

            {/* Middle: Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                    <div
                    key={index}
                    className={`flex ${
                      message.senderEmail === user.email
                        ? "justify-end"
                        : "justify-start"
                    } mb-4`}
                  > 
                  
                  <div
                    className={`bg-${
                      message.senderEmail === user.email ? "black-300" : "pink-400"
                    } text-${
                      message.senderEmail === user.email ? "pink-400" : "white"
                    } p-2 w-fit rounded-lg ${
                      message.senderEmail === user.email
                        ? "rounded-tr-none ml-auto"
                        : "rounded-tl-none"
                    }`}
                  >
                    <span>
  {new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })}
</span>

                    <p>{message.message}</p>
                  </div>   
                   </div>

                ))
              ) : (
                <p>No messages yet</p>
              )}
            </div>

            {/* Bottom: Message Input */}
            <div className="p-4 bg-black-200 flex items-center space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}

                placeholder="Type a message"
                className="flex-1 p-2 rounded bg-gray-800 text-white focus:outline-none"
              />
              <button
                  onClick={handleSendMessage}
                className="border-rose-500 border-[1px] hover:bg-rose-500 hover:text-white duration-300 transition-all text-gray-300 px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
            Select a contact to start chatting
          </div>
        )}
      </div>
  </div>
  );
};

export default Chats;
