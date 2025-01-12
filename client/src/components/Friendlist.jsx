import React from 'react';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../state/useConversion';

const Friendlist = ({ favourites }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();

  return (
    <div
      className={`${
        selectedConversation ? 'hidden md:block' : 'block'
      } w-10/12 md:w-1/4 bg-black-100 md:border-pink-400 md:h-full h-fit md:border p-4 overflow-y-auto`}
    >
      <h2 className="text-lg mb-4 text-white">Chats</h2>
      <ul>
        {favourites?.map((friend) => (
          <li
            key={friend._id}
            onClick={() => setSelectedConversation(friend)}
            className={`mb-2 p-2 cursor-pointer flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded ${
              selectedConversation?._id === friend._id && 'bg-black-200'
            }`}
          >
            <img
              src={friend.profile}
              alt={friend.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white">{friend.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friendlist;
