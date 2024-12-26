import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message', // Listado de Message
        default: []
      }
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Listado de Members
        required: true
      }
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Relación con el modelo User
      required: true
    }
  },
  { timestamps: true }
);

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;
