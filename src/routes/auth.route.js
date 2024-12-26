import express from 'express';
import {
  login,
  register,
  verifyAccount,
  forgotPassword,
  resetPassword,
  loggedUserProfile,
  updateLoggedUserProfile
} from '../controllers/auth.controller.js';
import {
  validateEmailForPasswordReset,
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateProfileUpdate
} from '../middlewares/validation.middleware.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Ruta para el registro (signup)
router.post('/register', validateRegister, register);

// Ruta para verificar cuenta
router.get('/verify/:token', verifyAccount);

// Ruta para el login
router.post('/login', validateLogin, login);

// Ruta para recuperar contraseña
router.post('/forgot-password', validateEmailForPasswordReset, forgotPassword);

// Ruta para resetear contraseña
// Restablecer contraseña (con token en la URL)
router.post(
  '/reset-password/:resetToken',
  validateResetPassword,
  resetPassword
);

// Obtener info usuario logueado
router.get('/me', authenticateUser, loggedUserProfile);

// Actualizar perfil usuario logueado
router.put(
  '/me',
  authenticateUser,
  validateProfileUpdate,
  updateLoggedUserProfile
);

export default router;
