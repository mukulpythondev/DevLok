import Chat from "../models/chatModel.js";
import Message from "../models/MessageModel.js";


// Create a new chat or retrieve an existing one
export const createChat = async (req, res) => {
  const { participantIds } = req.body;

  try {
    let chat = await Chat.findOne({ participants: { $all: participantIds } });
    
    if (!chat) {
      chat = new Chat({ participants: participantIds });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat', error });
  }
};

// Send a new message and update the last message in the chat
export const sendMessage = async (req, res) => {
  const { chatId, senderId, content } = req.body;

  try {
    const message = new Message({ chatId, sender: senderId, content });
    await message.save();

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Retrieve all messages for a chat
export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

// Fetch all chats for a user, including the last message in each chat
export const getChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'username email') // Fetch participant info
      .populate({
        path: 'lastMessage',
        select: 'content createdAt', // Select only relevant fields from last message
      })
      .sort({ updatedAt: -1 }); // Sort by the most recently updated chat

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error });
  }
};
