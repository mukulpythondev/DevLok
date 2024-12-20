import { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { AppContext } from "../context/AppContext";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Friendlist from "../components/Friendlist";
import Chatboxtop from "../components/Chatboxtop";
import ChatMessagebox from "../components/ChatMessagebox";
import useSendMessage from "../hooks/useSendMessage";
import useConversation from "../state/useConversion";


const Chats = () => {
  const { user } = useContext(AppContext);
  const [favourites, setFavourites] = useState([]);
  const { sendMessages } = useSendMessage();
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { selectedConversation, setSelectedConversation } = useConversation();
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

  useEffect(() => {
    getFavourites();
  }, [user]);
  useEffect(() => {
    return setSelectedConversation(null);
  }, [setSelectedConversation]);
  const handleSendMessage = async () => {
    if(inputMessage.trim().length ==0) return;
    await sendMessages(inputMessage);
    setInputMessage("");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-black-100 text-rose-300 h-screen pt-32 pb-40 w-full flex">
      <Friendlist favourites={favourites} />

      <div className="w-3/4 bg-gray-800 flex flex-col">
        {selectedConversation ? (
          <>
            <Chatboxtop/>
            <ChatMessagebox/>
           
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
