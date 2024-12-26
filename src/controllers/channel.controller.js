import Channel from '../models/channel.model.js';
import Workspace from '../models/workspace.model.js';
import Message from '../models/message.model.js';
import errorCodes from '../errors/errors.js';
import { User } from '../models/user.model.js';

// Ver todos los Canales dentro de un Workspace específico
export const getChannelsInWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Verificar si el workspace existe
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: 'Workspace no encontrado' });

    // Obtener los canales asociados al workspace
    const channels = await Channel.find({ workspace: workspaceId });
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los canales', error });
  }
};

// Crear un Canal dentro de un Workspace específico
export const createChannel = async (req, res) => {
  try {
    const { channelName } = req.body;

    // Buscar workspace
    const foundWorkspace = await Workspace.findById(
      req.params.workspaceId
    ).populate('channels');

    // Chequear que el channel ya no forma parte del workspace para evitar agregarlo 2 veces
    const foundChannels = foundWorkspace.channels.filter(
      (c) => c.name === channelName
    );

    if (foundChannels.length > 0) {
      return res.status(400).json({
        message: 'El channel ya existe en el workspace',
        code: errorCodes.CHANNEL_ALREADY_EXISTS
      });
    }

    // Crear canal nuevo
    const newChannel = new Channel({
      name: channelName,
      members: [req.user.id],
      owner: req.user.id
    });
    await newChannel.save();

    // Asociar canal nuevo con workspace
    foundWorkspace.channels.push(newChannel._id);
    await foundWorkspace.save();
    res.status(201).json({ channels: foundWorkspace.channels });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al crear el canal', error });
  }
};

// Buscar un Canal específico dentro de un Workspace
export const getChannelById = async (req, res) => {
  try {
    const { workspaceId, channelId } = req.params;

    // Verificar si el workspace existe
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: 'Workspace no encontrado' });

    // Verificar si el canal existe
    const channel = await Channel.findById(channelId).populate({
      path: 'messages',
      select: 'content sender createdAt',
      populate: [
        {
          path: 'sender',
          select: 'image username'
        }
      ]
    });
    if (!channel) {
      return res.status(404).json({ message: 'Canal no encontrado' });
    }

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el canal', error });
  }
};

// Actualizar un Canal dentro de un Workspace
export const updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { channelName } = req.body;
    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      {
        name: channelName
      },
      { new: true }
    );
    if (!updatedChannel)
      return res.status(404).json({ message: 'Channel no encontrado' });
    res.status(200).json({
      _id: updatedChannel._id,
      name: updatedChannel.name
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar el workspace', error });
  }
};

// Eliminar un Canal dentro de un Workspace
export const deleteChannel = async (req, res) => {
  try {
    const { workspaceId, channelId } = req.params;

    // Verificar si el workspace existe
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: 'Workspace no encontrado' });

    // Eliminar el canal
    const deletedChannel = await Channel.findByIdAndDelete(channelId);
    if (!deletedChannel) {
      return res.status(404).json({ message: 'Canal no encontrado' });
    }

    // Desasociar channel de workspace
    workspace.channels = workspace.channels.filter(
      (c) => c._id.toString() !== channelId.toString()
    );

    await workspace.save();

    // Eliminar mensajes
    await Message.deleteMany({
      _id: { $in: deletedChannel.messages.map((m) => m._id) }
    });

    res.status(200).json({ message: 'Canal eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el canal', error });
  }
};

// Buscar channels
export const searchChannels = async (req, res) => {
  try {
    const { name } = req.query;
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId).populate(
      'channels',
      'name members'
    );
    if (!workspace)
      return res.status(404).json({ message: 'Workspace no encontrado' });

    const channels = workspace.channels.filter((c) => {
      const isChannelMember = c.members.find(
        (m) => m._id.toString() === req.user.id.toString()
      );

      if (c.name.includes(name) && !isChannelMember) {
        return true;
      }
      return false;
    });
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los channels', error });
  }
};

// Unirse a un channel
export const joinChannel = async (req, res) => {
  try {
    const { workspaceId, channelId } = req.params;
    const channel = await Channel.findById(channelId);
    const user = await User.findById(req.user.id);

    console.log(workspaceId, channelId);

    if (!channel) {
      return res.status(404).json({
        message: 'Channel no encontrado',
        code: errorCodes.CHANNEL_NOT_FOUND
      });
    }

    // Chequeamos si el user es actualmente miembro del channel para no unirlo nuevamente
    const userInChannel = channel.members.filter(
      (m) => m.toString() === user._id.toString()
    );
    if (userInChannel.length > 0) {
      return res.status(400).json({
        message: 'Ya eres miembro de este channel',
        code: errorCodes.ALREADY_CHANNEL_MEMBER
      });
    }

    // Agregamos el user al channel como miembro
    channel.members.push(req.user.id);
    await channel.save();

    res.status(200).json({
      workspaceId,
      channelId: channel._id
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener los workspaces', error });
  }
};
