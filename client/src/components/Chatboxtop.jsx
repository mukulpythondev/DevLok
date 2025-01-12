import { useSocketContext } from "../context/SocketContext";
import useConversation from "../state/useConversion";
import { IoArrowBack } from "react-icons/io5"; // Importing the back arrow icon

function Chatboxtop() {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();

  const getOnlineUsersStatus = (userId) => {
    return onlineUsers.includes(userId) ? "Online" : "Offline";
  };

  return (
    <div className="p-4 bg-black-100 border-[1px] border-pink-400 flex items-center space-x-4">
      {/* Back Arrow for Mobile */}
      <button
        onClick={() => setSelectedConversation(null)}
        className="block md:hidden p-2 text-rose-300 rounded hover:bg-gray-800"
      >
        <IoArrowBack size={20} />
      </button>
      <h2 className="text-lg text-white">{selectedConversation.name}</h2>
      <h4 className="text-sm font-bold text-rose-200">
        - {getOnlineUsersStatus(selectedConversation._id)}
      </h4>
    </div>
  );
}

export default Chatboxtop;
