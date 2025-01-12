import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';

const Message = ({message}) => {
    const { user } = useContext(AppContext);
    const itsMe = message.senderId === user._id;
  
    const chatName = itsMe ? "justify-end" : "justify-start";
    const chatColor = itsMe ? "bg-rose-500" : "";
  
    const createdAt = new Date(message.createdAt);
    const formattedTime = createdAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  return (
    <div>
      <div className={`p-4 flex ${chatName}`}>
        <div className={`chat  `}>
          <div className={` text-white w-fit max-w-lg p-2 overflow-hidden rounded-lg  ${chatColor}`}>
            {message.message}
          </div>
          <div className="chat-footer">{formattedTime}</div>
        </div>
      </div>
    </div>
  )
}

export default Message