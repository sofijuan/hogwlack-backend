import jwt from "jsonwebtoken"; // Librería para manejar tokens JWT
import ENVIRONMENT from "../config/environment.config.js";
import { User } from "../models/user.model.js";

// Middleware para proteger rutas
export const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del header
  if (!token) {
    return res.status(401).json({ message: "No se proporcionó un token" });
  }

  try {
    const decoded = jwt.verify(token, ENVIRONMENT.SECRET_KEY); // Decodifica el token

    // Chequeamos que exista el user
    const userFound = await User.findOne({ _id: decoded.id });
    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.user = { id: userFound._id }; // Guarda el usuario en req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token no válido" });
  }
};

export const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};
