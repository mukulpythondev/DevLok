import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // chatId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Chat',
  //   required: true,
  //   index:true
  // },
  senderId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',
    required: true,
    index:true
  },
  recieverId  : {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',
    required: true,
    index:true
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;
