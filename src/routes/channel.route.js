import express from "express";
import {
  getChannelsInWorkspace,
  createChannel,
  getChannelById,
  updateChannel,
  deleteChannel,
} from "../controllers/channel.controller.js";
import { validateChannel } from "../middlewares/validation.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateWorkspaceMembership } from "../middlewares/workspace.middleware.js";

const router = express.Router();

// Ver todos los Canales dentro de un Workspace específico
router.get("/:workspaceId", authenticateUser, getChannelsInWorkspace);

// Crear un Canal dentro de un Workspace específico
router.post(
  "/:workspaceId",
  validateChannel,
  authenticateUser,
  validateWorkspaceMembership,
  createChannel
);

// Obtener un Canal específico dentro de un Workspace
router.get("/:workspaceId/:channelId", authenticateUser, getChannelById);

// Actualizar un Canal dentro de un Workspace
router.put(
  "/:workspaceId/:channelId",
  validateChannel,
  authenticateUser,
  updateChannel
);

// Eliminar un Canal dentro de un Workspace
router.delete("/:workspaceId/:channelId", authenticateUser, deleteChannel);

export default router;
