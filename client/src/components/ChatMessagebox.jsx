import React, { useEffect, useRef, memo } from "react";
import useGetMessage from "../hooks/useGetMessage";
import useGetSocketMessage from "../hooks/useGetSocketMessage";
import Loader from "./Loader";
import Message from "./Message";

const ChatMessagebox = () => {
  const { loading, messages } = useGetMessage();
  useGetSocketMessage(); // Listening for incoming messages
  
  const lastMsgRef = useRef();
  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {loading ? (
        <Loader />
      ) : (
        messages.map((message,index) => (
          <div key={message._id  || index} ref={lastMsgRef}>
            <Message message={message} />
          </div>
        ))
      )}

      {!loading && messages.length === 0 && (
        <div>
          <p className="text-center mt-[20%]">Say! Hi to start the conversation</p>
        </div>
      )}
    </div>
  );
};

// Memoizing ChatMessagebox to prevent unnecessary re-renders
export default memo(ChatMessagebox);
