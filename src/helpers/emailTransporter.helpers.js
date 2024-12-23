import nodemailer from "nodemailer";
import ENVIRONMENT from "../config/environment.config.js";

// Configuración del transporte de correo electrónico
const trasporterEmail = nodemailer.createTransport({
  service: "gmail",
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: ENVIRONMENT.EMAIL_USER,
    pass: ENVIRONMENT.EMAIL_PASSWORD,
  },
});

// Función para enviar un correo electrónico
export const sendMail = async (emailInfo) => {
  try {
    const emailData = { ...emailInfo, from: ENVIRONMENT.EMAIL_USER };
    const info = await trasporterEmail.sendMail(emailData);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error(
      "Hubo un problema al enviar el correo electrónico. Intenta de nuevo más tarde."
    );
  }
};
