import express from "express";
import {
  getMessagesInChannel,
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller.js";
import { validateMessage } from "../middlewares/validation.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Ver todos los Mensajes dentro de un Canal específico
router.get("/:workspaceId/:channelId", authenticateUser, getMessagesInChannel);

// Crear un Mensaje dentro de un Canal específico
router.post(
  "/:workspaceId/:channelId",
  validateMessage,
  authenticateUser,
  createMessage
);

// Obtener un Mensaje específico dentro de un Canal
router.get(
  "/:workspaceId/:channelId/:messageId",
  authenticateUser,
  getMessageById
);

// Actualizar un Mensaje dentro de un Canal específico
router.put(
  "/:workspaceId/:channelId/:messageId",
  validateMessage,
  authenticateUser,
  updateMessage
);

// Eliminar un Mensaje dentro de un Canal
router.delete(
  "/:workspaceId/:channelId/:messageId",
  authenticateUser,
  deleteMessage
);

export default router;
