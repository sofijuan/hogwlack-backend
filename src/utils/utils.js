import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/environment.config.js';
import { sendMail } from '../helpers/emailTransporter.helpers.js';

export async function sendVerificationEmail(email, id) {
  // Generar token de verificación
  const token = jwt.sign({ id }, ENVIRONMENT.SECRET_KEY, {
    expiresIn: '1d'
  });
  // Enviar correo de verificación
  const verificationLink = `${ENVIRONMENT.FRONTEND_URL}/verify/${token}`;
  await sendMail({
    to: email,
    subject: 'Verificación de cuenta',
    html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
         <a href="${verificationLink}">${verificationLink}</a>`
  });
}

export async function sendResetPasswordEmail(email, id) {
  // Generar token de verificación
  const resetToken = jwt.sign({ id }, ENVIRONMENT.SECRET_KEY, {
    expiresIn: '1d'
  });
  // Enviar correo de olvido de contraseña
  const forgotPasswordLink = `${ENVIRONMENT.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendMail({
    to: email,
    subject: 'Recuperación de contraseña',
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${forgotPasswordLink}">${forgotPasswordLink}</a>`
  });
}
