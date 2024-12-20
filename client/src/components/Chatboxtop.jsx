import { useSocketContext } from "../context/SocketContext";
import useConversation from "../state/useConversion";


function Chatboxtop() {
  const { selectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const getOnlineUsersStatus = (userId) => {
    return onlineUsers.includes(userId) ? "Online" : "Offline";
  };

  return (
    <div className="p-4 bg-black-100 border-[1px] border-pink-400 flex items-center space-x-4">
              <h2 className="text-lg">{selectedConversation.name}</h2>
              <h4 className="text-sm" > {getOnlineUsersStatus(selectedConversation._id)} </h4>
            </div>
  );
}

export default Chatboxtop;