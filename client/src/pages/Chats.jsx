import { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { AppContext } from "../context/AppContext";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const socket = io("http://localhost:8000");

const Chats = () => {
  const { user } = useContext(AppContext);
  const [favourites, setFavourites] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState("");

  const getFavourites = async () => {
    if (user) {
      try {
        const { data } = await axiosInstance.get("/users/getfavourite");
        setFavourites(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favourites:", error);
        setLoading(false);
      }
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const { data } = await axiosInstance.get(`/users/chat/${chatId}/messages`);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    getFavourites();
  }, [user]);

  useEffect(() => {
    const onReceiveMessage = (message) => {
      if (message.chatId === currentChatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on("receive-message", onReceiveMessage);
    return () => {
      socket.off("receive-message", onReceiveMessage);
    };
  }, [currentChatId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      chatId: currentChatId,
      senderId: user._id,
      content: inputMessage,
    };

    socket.emit("send-message", messageData);

    try {
      const { data } = await axiosInstance.post("/users/chat/send-message", messageData);
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(messages)
      setInputMessage("");
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const initiateChat = async (email, name, recipientId) => {
    setRecipientEmail(email);
    toast.success("Chatting with " + name);

    try {
      const { data } = await axiosInstance.post("/users/chat/create", { participantIds: [user._id, recipientId] });
      setCurrentChatId(data._id);
      fetchMessages(data._id);
      socket.emit("initiate-chat", { senderEmail: user.email, recipientEmail: email });
    } catch (error) {
      console.error("Error initiating chat:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-black-100 text-rose-300 h-screen pt-32 pb-40 w-full flex">
      <div className="w-1/4 bg-black-100 border-pink-400 border-[1px] p-4 overflow-y-auto">
        <h2 className="text-lg mb-4">Chats</h2>
        <ul>
          {favourites?.map((friend) => (
            <li
              key={friend._id}
              onClick={() => initiateChat(friend.email, friend.name,friend._id)}
              className={`mb-2 p-2 cursor-pointer flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded ${
                recipientEmail === friend.email && "bg-black-100"
              }`}
            >
              <img src={friend.profile} alt={friend.name} className="w-8 h-8 rounded-full" />
              <span>{friend.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 bg-gray-800 flex flex-col">
        {recipientEmail ? (
          <>
            <div className="p-4 bg-black-100 border-[1px] border-pink-400 flex items-center space-x-4">
              <h2 className="text-lg">{recipientEmail}</h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === user._id ? "justify-end" : "justify-start"
                    } mb-4`}
                  >
                    <div
                      className={`bg-${
                        message.sender === user._id ? "black-300" : "pink-400"
                      } text-${
                        message.sender === user._id ? "pink-400" : "white"
                      } p-2 w-fit rounded-lg ${
                        message.sender === user._id ? "rounded-tr-none ml-auto" : "rounded-tl-none"
                      }`}
                    >
                      <p>{message.content}</p>
                      <span>
                        {new Date(message.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No messages yet</p>
              )}
            </div>

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
