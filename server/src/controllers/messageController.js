import Chat from "../models/chatModel.js";
import Message from "../models/MessageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { encryptMessage, decryptMessage } from "../utils/encryption.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id; // Current logged-in user

    if (!message || !recieverId) {
      throw new ApiError(400, "Message and receiver ID are required.");
    }

    console.log("Receiver ID:", recieverId);

    // Encrypt the message
    const encryptedMessage = encryptMessage(message);

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

    // Create a new message with encrypted content
    const newMessage =  new Message({
      senderId,
      recieverId,
      message: encryptedMessage,
    });

    if (newMessage) {
      // Add the message to the conversation
      conversation.messages.push(newMessage._id);
    }

    // Save conversation and message concurrently
    await Promise.all([conversation.save(), newMessage.save()]);

    // Emit the encrypted message if the receiver is online
    const receiverSocketId = await getReceiverSocketId(recieverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        senderId,
        message: message,
        createdAt: newMessage.createdAt,
      });
      console.log(`Message sent to user ${recieverId}`);
    } else {
      console.log(`User ${recieverId} is offline. Message saved to database.`);
    }

    // Respond with success
    return res
      .status(201)
      .json(new ApiResponse(201, { senderId, recieverId, createdAt: newMessage.createdAt }, "Message sent successfully."));
  } catch (error) {
    console.error("Error in sendMessage:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error.";
    return res.status(statusCode).json(new ApiError(statusCode, message));
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id;

    if (!chatUser) {
      throw new ApiError(400, "Chat user ID is required.");
    }

    // Find conversation
    const conversation = await Chat.findOne({
      members: { $all: [senderId, chatUser] },
    }).populate("messages");

    if (!conversation) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No conversation found."));
    }
    // Decrypt messages
    const decryptedMessages = conversation.messages.map((msg) => {
      return {
        message: decryptMessage(msg.message), 
        createdAt: msg.createdAt, 
        senderId: msg.senderId
      };
    });

    if (!decryptedMessages || decryptedMessages.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No messages found."));
    }
    // console.log("dcrypted messages", decryptedMessages)
    return res
      .status(200)
      .json(new ApiResponse(200, decryptedMessages, "Messages retrieved successfully."));
  } catch (error) {
    console.error("Error in getMessage:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error.";
    return res.status(statusCode).json(new ApiError(statusCode, message));
  }
};
