import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Relación con el modelo User
      required: true
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true
    }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
