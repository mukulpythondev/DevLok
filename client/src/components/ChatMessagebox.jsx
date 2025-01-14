import React, { useEffect, useRef, useState } from "react";
import useGetMessage from "../hooks/useGetMessage";
import useGetSocketMessage from "../hooks/useGetSocketMessage";
import Loader from "./Loader";
import Message from "./Message";
import useConversation from "../state/useConversion";
import { IoArrowDown } from "react-icons/io5";

const ChatMessagebox = () => {
  const { loading, messages } = useGetMessage();
  const { selectedConversation } = useConversation();
  useGetSocketMessage();

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const lastMsgRef = useRef(null);
  const messageBoxRef = useRef(null);

  // Scroll to the bottom when messages are updated
  useEffect(() => {
    if (messages.length > 0 && isScrolledToBottom) {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle scroll events to track if near the bottom
  const handleScroll = () => {
    if (!messageBoxRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messageBoxRef.current;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;
    if (isScrolledToBottom !== nearBottom) {
      setIsScrolledToBottom(nearBottom);
    }
  };

  const scrollToBottom = () => {
    lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsScrolledToBottom(true);
  };

  return (
    <div
      className="flex-1 overflow-y-scroll bg-gray-700 p-4 relative"
      ref={messageBoxRef}
      onScroll={handleScroll}
    >
      {loading ? (
        <Loader />
      ) : (
        messages.map((message, index) => (
          <div
            key={message._id || index}
            ref={index === messages.length - 1 ? lastMsgRef : null}
          >
            <Message message={message} />
          </div>
        ))
      )}

      {!loading && messages.length === 0 && (
        <div>
          <p className="text-center mt-[20%] text-white">
            Say Hi to start the conversation
          </p>
        </div>
      )}

      {!isScrolledToBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-5 right-5 p-3 bg-rose-500 text-white rounded-full shadow-md hover:bg-rose-600 transition"
        >
          <IoArrowDown size={20} />
        </button>
      )}
    </div>
  );
};

export default ChatMessagebox;
