import Chat from "../models/chatModel.js";
import Message from "../models/MessageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id; // Current logged-in user
    console.log("Reciever id" , recieverId)
    // Check if conversation exists between sender and receiver
    let conversation = await Chat.findOne({
      members: { $all: [senderId, recieverId] },
    });

    if (!conversation) {
      // If no conversation exists, create one
      conversation = await Chat.create({
        members: [senderId, recieverId],
      });
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      recieverId,
      message,
    });

    if (newMessage) {
      // Add the message to the conversation
      conversation.messages.push(newMessage._id);
    }

    // Save conversation and message concurrently
    await Promise.all([conversation.save(), newMessage.save()]);

    // Check if the receiver is online and emit message if they are
    const receiverSocketId = await getReceiverSocketId(recieverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        senderId,
        message,
        createdAt: newMessage.createdAt,
      });
      console.log(`Message sent to user ${recieverId}`);
    } else {
      console.log(`User ${recieverId} is offline. Message saved to database.`);
    }

    // Respond with the created message
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id;
    const conversation = await Chat.findOne({
      members: { $all: [senderId, chatUser] },
    }).populate("messages");
    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
