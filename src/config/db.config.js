// Configuración de la Base de Datos

import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";

const connectDB = async () => {
  try {
    if (!ENVIRONMENT.MONGO_DB_CONNECTION_STR) {
      throw new Error(
        "La variable MONGO_URI no está definida en el archivo .env"
      );
    }

    const conn = await mongoose.connect(ENVIRONMENT.MONGO_DB_CONNECTION_STR);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar con MongoDB: ${error.message}`);
    process.exit(1); // Salir de la aplicación con error
  }
};

export default connectDB;
