// Servidor principal

import dotenv from 'dotenv'; // Para cargar variables de entorno
import server from './app.js'; // Importar la configuración de Express
import connectDB from './config/db.config.js'; // Importar la función para conectar a la base de datos

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

connectDB(); // Conectar a la base de datos

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Iniciar el servidor y escuchar en el puerto definido
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
