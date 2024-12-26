import express from 'express';
import {
  validateChannel,
  validateChannelSearch
} from '../middlewares/validation.middleware.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateWorkspaceMembership } from '../middlewares/workspace.middleware.js';
import {
  createChannel,
  deleteChannel,
  searchChannels,
  updateChannel,
  getChannelById,
  joinChannel
} from '../controllers/channel.controller.js';

import {
  validateChannelOwnership,
  validateChannelMembership
} from '../middlewares/channel.middleware.js';

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  validateChannel,
  authenticateUser,
  validateWorkspaceMembership,
  createChannel
);

router.delete(
  '/:channelId',
  authenticateUser,
  validateChannelOwnership,
  deleteChannel
);

router.put(
  '/:channelId',
  validateChannel,
  authenticateUser,
  validateChannelOwnership,
  updateChannel
);

router.get('/search', authenticateUser, searchChannels);

router.post('/:channelId/join', authenticateUser, joinChannel);

router.get('/:channelId', authenticateUser, getChannelById);

export default router;
