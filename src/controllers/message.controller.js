import messageRepository from "../repositories/message.repository.js";
import channelRepository from "../repositories/channel.repository.js";

// Ver todos los Mensajes dentro de un Canal específico
export const getMessagesInChannel = async (req, res) => {
  try {
    const { workspaceId, channelId } = req.params;
    const channel = await channelRepository.getChannelById(channelId);
    if (!channel)
      return res.status(404).json({ message: "Canal no encontrado" });

    const messages = await messageRepository.getMessagesByChannel(channelId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los mensajes", error });
  }
};

// Crear un Mensaje dentro de un Canal específico
export const createMessage = async (req, res) => {
  try {
    const { workspaceId, channelId } = req.params;
    const { content } = req.body;

    const channel = await channelRepository.getChannelById(channelId);
    if (!channel)
      return res.status(404).json({ message: "Canal no encontrado" });

    const newMessage = await messageRepository.createMessage({
      content,
      userId: req.user.id,
      channelId,
    });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el mensaje", error });
  }
};

// Buscar un Mensaje específico dentro de un Canal
export const getMessageById = async (req, res) => {
  try {
    const { workspaceId, channelId, messageId } = req.params;
    const channel = await channelRepository.getChannelById(channelId);
    if (!channel)
      return res.status(404).json({ message: "Canal no encontrado" });

    const message = await messageRepository.getMessageById(messageId);
    if (!message)
      return res.status(404).json({ message: "Mensaje no encontrado" });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el mensaje", error });
  }
};

// Actualizar un Mensaje dentro de un Canal específico
export const updateMessage = async (req, res) => {
  try {
    const { workspaceId, channelId, messageId } = req.params;
    const { content } = req.body;

    const channel = await channelRepository.getChannelById(channelId);
    if (!channel)
      return res.status(404).json({ message: "Canal no encontrado" });

    const updatedMessage = await messageRepository.updateMessage(messageId, {
      content,
    });
    if (!updatedMessage)
      return res.status(404).json({ message: "Mensaje no encontrado" });

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el mensaje", error });
  }
};

// Eliminar un Mensaje dentro de un Canal
export const deleteMessage = async (req, res) => {
  try {
    const { workspaceId, channelId, messageId } = req.params;
    const channel = await channelRepository.getChannelById(channelId);
    if (!channel)
      return res.status(404).json({ message: "Canal no encontrado" });

    const deletedMessage = await messageRepository.deleteMessage(messageId);
    if (!deletedMessage)
      return res.status(404).json({ message: "Mensaje no encontrado" });

    res.status(200).json({ message: "Mensaje eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el mensaje", error });
  }
};
