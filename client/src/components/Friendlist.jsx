import React from 'react'
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../state/useConversion';

const Friendlist = ({favourites}) => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { socket, onlineUsers } = useSocketContext();
    // const isOnline = onlineUsers.includes(user._id);
  return (
    <div className="w-1/4 bg-black-100 border-pink-400 border-[1px] p-4 overflow-y-auto">
        <h2 className="text-lg mb-4">Chats</h2>
        <ul>
          {favourites?.map((friend) => (
            <li
              key={friend._id}
              onClick={() => setSelectedConversation(friend)}
              className={`mb-2 p-2 cursor-pointer flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded ${
                selectedConversation?._id === friend._id && "bg-black-100"
              }`}
            >
              <img src={friend.profile} alt={friend.name} className="w-8 h-8 rounded-full" />
              <span>{friend.name}</span>
            </li>
          ))}
        </ul>
      </div>
  )
}

export default Friendlist