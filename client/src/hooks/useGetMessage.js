import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import useConversation from "../state/useConversion";
const useGetMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessage, selectedConversation } = useConversation(); 
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      if (selectedConversation && selectedConversation._id) {
        try {
          const res = await axiosInstance.get(
            `users/message/get/${selectedConversation._id}`
          );

          setMessage(res.data.data);
        } catch (error) {
          console.error("Error in getting messages:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    getMessages();
  }, [selectedConversation, setMessage]);

  return { loading, messages };
};

export default useGetMessage;
