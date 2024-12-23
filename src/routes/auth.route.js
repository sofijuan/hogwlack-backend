import express from "express";
import {
  login,
  register,
  verifyAccount,
  forgotPassword,
  logout,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  validateEmailForPasswordReset,
  validateLogin,
  validateRegister,
  validateResetPassword,
} from "../middlewares/validation.middleware.js";

const router = express.Router();

// Ruta para el registro (signup)
router.post("/register", validateRegister, register);

// Ruta para verificar cuenta
router.get("/verify/:token", verifyAccount);

// Ruta para el login
router.post("/login", validateLogin, login);

// Ruta para recuperar contraseña
router.post("/forgot-password", validateEmailForPasswordReset, forgotPassword);

// Ruta para resetear contraseña
// Restablecer contraseña (con token en la URL)
router.post(
  "/reset-password/:resetToken",
  validateResetPassword,
  resetPassword
);

// Ruta para cerrar sesión
router.post("/logout", logout);

export default router;
