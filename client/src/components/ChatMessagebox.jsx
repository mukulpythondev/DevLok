import React, { useEffect, useRef, memo, useState } from "react";
import useGetMessage from "../hooks/useGetMessage";
import useGetSocketMessage from "../hooks/useGetSocketMessage";
import Loader from "./Loader";
import Message from "./Message";
import useConversation from "../state/useConversion";
import { IoArrowDown } from "react-icons/io5"; // Import arrow icon

const ChatMessagebox = () => {
  const { loading, messages } = useGetMessage();
  const { selectedConversation } = useConversation();
  useGetSocketMessage();

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true); // Track scroll state
  const lastMsgRef = useRef(null);
  const messageBoxRef = useRef(null);

  // Scroll to the last message when messages or selectedConversation changes
  useEffect(() => {
    if (messages.length > 0) {
      const scrollTimeout = setTimeout(() => {
        if (lastMsgRef.current) {
          lastMsgRef.current.scrollIntoView({
            behavior: "smooth",
          });
        }
        setIsScrolledToBottom(true);
      }, 100);
      return () => clearTimeout(scrollTimeout); // Cleanup timeout on unmount
    }
  }, [ selectedConversation]);

  // Track scroll position to show/hide the "scroll-to-bottom" button
  const handleScroll = () => {
    if (!messageBoxRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messageBoxRef.current;
    setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 50); // Check if near bottom
  };

  // Scroll to the bottom manually
  const scrollToBottom = () => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({
        behavior: "smooth",
      });
      setIsScrolledToBottom(true);
    }
  };

  return (
    <div
      className="flex-1 overflow-y-scroll  bg-gray-700 p-4 relative"
      ref={messageBoxRef}
      onScroll={handleScroll} // Track scroll events
    >
      {/* Loader or Messages */}
      {loading ? (
        <Loader />
      ) : (
        messages.map((message, index) => (
          <div
            key={message._id || index}
            ref={index === messages.length - 1 ? lastMsgRef : null} // Assign ref to the last message
          >
            <Message message={message} />
          </div>
        ))
      )}

      {/* No messages state */}
      {!loading && messages.length === 0 && (
        <div>
          <p className="text-center mt-[20%] text-white">
            Say Hi to start the conversation
          </p>
        </div>
      )}

      {/* Scroll-to-bottom Button */}
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

export default memo(ChatMessagebox);
