import express from 'express';
import {
  getUserWorkspaces,
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  searchWorkspaces,
  joinWorkspace
} from '../controllers/workspace.controller.js';

import {
  validateWorkspace,
  validateWorkspaceSearch,
  validateWorkspaceUpdate
} from '../middlewares/validation.middleware.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateWorkspaceOwnership } from '../middlewares/workspace.middleware.js';

const router = express.Router({ mergeParams: true });

// Unirse a un workspace
router.post('/join/:_id', authenticateUser, joinWorkspace);

// Ver todos los Workspaces a los que está unido el usuario
router.get('/', authenticateUser, getUserWorkspaces);

// Crear un Workspace
router.post('/', validateWorkspace, authenticateUser, createWorkspace);

// Ver todos los Workspaces existentes en base a una busqueda
router.get('/search', authenticateUser, searchWorkspaces);

// Obtener un Workspace específico por ID
router.get('/:_id', authenticateUser, getWorkspaceById);

// Actualizar un Workspace
router.put(
  '/:_id',
  validateWorkspaceUpdate,
  authenticateUser,
  validateWorkspaceOwnership,
  updateWorkspace
);

// Eliminar un Workspace
router.delete(
  '/:_id',
  authenticateUser,
  validateWorkspaceOwnership,
  deleteWorkspace
);

export default router;
