import express from 'express';
import { createMessage } from '../controllers/message.controller.js';
import { validateMessage } from '../middlewares/validation.middleware.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateChannelMembership } from '../middlewares/channel.middleware.js';

const router = express.Router({ mergeParams: true });

// Crear un Mensaje dentro de un Canal específico
router.post(
  '/',
  validateMessage,
  authenticateUser,
  validateChannelMembership,
  createMessage
);

export default router;
