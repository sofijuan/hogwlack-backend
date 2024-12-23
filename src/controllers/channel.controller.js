import Channel from "../models/channel.model.js";
import Workspace from "../models/workspace.model.js";
import errorCodes from "../errors/errors.js";

// Ver todos los Canales dentro de un Workspace específico
export const getChannelsInWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Verificar si el workspace existe
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace no encontrado" });

    // Obtener los canales asociados al workspace
    const channels = await Channel.find({ workspace: workspaceId });
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los canales", error });
  }
};

// Crear un Canal dentro de un Workspace específico
export const createChannel = async (req, res) => {
  try {
    const { channelName } = req.body;

    // Agregar canal a workspace
    const foundWorkspace = await Workspace.findById(
      req.params.workspaceId
    ).populate("channels");

    // Chequear que el channel ya no forma parte del workspace para evitar agregarlo 2 veces
    const foundChannels = foundWorkspace.channels.filter(
      (c) => c.name === channelName
    );

    console.log(foundChannels);
    if (foundChannels.length > 0) {
      return res.status(400).json({
        message: "El channel ya existe en el workspace",
        code: errorCodes.CHANNEL_ALREADY_EXISTS,
      });
    }

    // Crear canal nuevo
    const newChannel = new Channel({
      name: channelName,
    });
    await newChannel.save();

    // Asociar canal nuevo con workspace
    foundWorkspace.channels.push(newChannel._id);
    await foundWorkspace.save();
    res
      .status(201)
      .json({ channels: foundWorkspace.channels, _id: foundWorkspace._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el canal", error });
  }
};

// Buscar un Canal específico dentro de un Workspace
export const getChannelById = async (req, res) => {
  try {
    const { workspaceId, channelId } = req.params;

    // Verificar si el workspace existe
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace no encontrado" });

    // Verificar si el canal existe
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Canal no encontrado" });
    }

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el canal", error });
  }
};

// Actualizar un Canal dentro de un Workspace
export const updateChannel = async (req, res) => {
  try {
    const { workspaceId, channelId } = req.params;
    const { name } = req.body;

    // Verificar si el workspace existe
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace no encontrado" });

    // Actualizar el canal
    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      { name },
      { new: true } // Para devolver el canal actualizado
    );
    if (!updatedChannel) {
      return res.status(404).json({ message: "Canal no encontrado" });
    }

    res.status(200).json(updatedChannel);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el canal", error });
  }
};

// Eliminar un Canal dentro de un Workspace
export const deleteChannel = async (req, res) => {
  try {
    const { workspaceId, channelId } = req.params;

    // Verificar si el workspace existe
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace no encontrado" });

    // Eliminar el canal
    const deletedChannel = await Channel.findByIdAndDelete(channelId);
    if (!deletedChannel) {
      return res.status(404).json({ message: "Canal no encontrado" });
    }

    res.status(200).json({ message: "Canal eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el canal", error });
  }
};
