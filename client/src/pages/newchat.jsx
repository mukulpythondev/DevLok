import React from 'react'

const newchat = () => {
  return (
    <div className="bg-black-100 text-rose-300 h-screen pt-32 pb-40 w-full flex">
      {/* Left Sidebar: Contacts */}
      <div className="w-1/4 bg-black-100 border-pink-400 border-[1px] p-4 overflow-y-auto">
        <h2 className="text-lg mb-4">Chats</h2>
        <ul>
          {favourites?.data?.map((friend) => (
            <li
              key={friend._id}
              onClick={() => initiateChat(friend.email)}
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

      {/* Right Chat Section */}
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
                      message.senderEmail === user.email ? "rose-800" : "white"
                    } text-${
                      message.senderEmail === user.email ? "pink-400" : "white"
                    } p-2 w-fit rounded-lg ${
                      message.senderEmail === user.email
                        ? "rounded-tr-none ml-auto"
                        : "rounded-tl-none"
                    }`}
                  >
                    <span>{message.senderEmail}</span>
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
  )
}

export default newchat