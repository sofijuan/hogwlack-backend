import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ENVIRONMENT from '../config/environment.config.js';
import {
  sendResetPasswordEmail,
  sendVerificationEmail
} from '../utils/utils.js';

// Registro (Sign Up)
export const register = async (req, res) => {
  try {
    const { username, email, password, image } = req.body;

    // Verificar que no exista un usuario con el mismo email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }
      sendVerificationEmail(email, existingUser._id);
      return res.status(200).json({ message: 'Verificar email' });
    }

    // Crear usuario
    const newUser = new User({
      username,
      email,
      password,
      isVerified: false,
      image: image ? image : undefined
    });
    await newUser.save();

    // Enviar email de verificacion
    sendVerificationEmail(email, newUser._id);

    res.status(201).json({
      message:
        'Usuario registrado exitosamente. Por favor verifica tu correo electrónico.'
    });
  } catch (error) {
    console.log('error', error);
    res
      .status(500)
      .json({ message: 'Error al registrar usuario', detail: error });
  }
};

// Inicio de sesión (Login)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la cuenta está verificada
    if (!user.isVerified) {
      return res.status(403).json({
        message:
          'Por favor verifica tu correo electrónico antes de iniciar sesión.'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Contraseña o email incorrecto' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      ENVIRONMENT.SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

// Verificar cuenta
export const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;

    // Verificar el token
    const decoded = jwt.verify(token, ENVIRONMENT.SECRET_KEY);

    // Marcar al usuario como verificado
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Cuenta verificada exitosamente' });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido o expirado', error });
  }
};

// Olvido de contraseña
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Envio de email de olvido de contraseña
    sendResetPasswordEmail(email, user._id);

    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al enviar correo de recuperación', error });
  }
};

// Cambio de contraseña
export const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    // Verificar el token
    const decoded = jwt.verify(resetToken, ENVIRONMENT.SECRET_KEY);

    // Buscar al usuario correspondiente
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar la contraseña del usuario
    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido o expirado', error });
  }
};

export const loggedUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      image: user.image
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error });
  }
};

export const updateLoggedUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { username, image } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username,
        image
      },
      { new: true }
    );
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      image: updatedUser.image
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar el workspace', error });
  }
};
