import mongoose from "mongoose";
const { Schema } = mongoose;

const ChatSchema = new Schema(
  {
    // chatId: {
    //   type: String, // Unique identifier for the chat (e.g., AtoB)
    //   required: true,
    //   unique: true,
    // },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
    // lastMessage: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Message", // Reference to the last message for quick access
    // },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      }
    ],
    createdAt: {type:Date, default:Date.now}
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
