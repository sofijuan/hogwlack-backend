import Workspace from '../models/workspace.model.js';
import Channel from '../models/channel.model.js';
import Message from '../models/message.model.js';
import { User } from '../models/user.model.js';

import errorCodes from '../errors/errors.js';

// Crear un Mensaje dentro de un Canal específico
export const createMessage = async (req, res) => {
  try {
    const { workspaceId, channelId } = req.params;
    const { content } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({
        message: 'Workspace no encontrado',
        code: errorCodes.WORKSPACE_NOT_FOUND
      });

    const channel = await Channel.findById(channelId);
    if (!channel)
      return res.status(404).json({
        message: 'Canal no encontrado',
        code: errorCodes.CHANNEL_NOT_FOUND
      });

    const user = await User.findById(req.user.id);

    // Crear nuevo mensaje
    const newMessage = new Message({
      content,
      sender: req.user.id,
      channel: channel._id
    });
    await newMessage.save();

    // Asociar mensaje a channel
    channel.messages.push(newMessage._id);
    await channel.save();

    res.status(201).json({
      content: newMessage.content,
      sender: { _id: user._id, username: user.username, image: user.image },
      createdAt: newMessage.createdAt,
      _id: newMessage._id
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al crear el mensaje', error });
  }
};
