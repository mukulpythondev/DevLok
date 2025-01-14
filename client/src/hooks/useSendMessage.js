import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import useConversation from "../state/useConversion";
const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessage, selectedConversation } = useConversation();
  const sendMessages = async (message) => {
    setLoading(true);
    try {
      
      const res = await axiosInstance.post(
        `/users/message/send/${selectedConversation._id}`,
        { message}
      );

      // Add the original (decrypted) message to the state for display purposes
      const newMessage = {
        ...res.data.data,
        message, // Replace encrypted message with the original message for local state
      };

      setMessage([...messages, newMessage]);
      setLoading(false);
    } catch (error) {
      console.error("Error in send messages:", error);
      setLoading(false);
    }
  };

  return { loading, sendMessages };
};

export default useSendMessage;
