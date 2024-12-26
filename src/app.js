// Configuración de Express

import express from 'express'; // Framework para manejar solicitudes HTTP
import cors from 'cors'; // Middleware para manejar CORS (permitir solicitudes desde otros dominios)
import authRoutes from './routes/auth.route.js'; // Rutas relacionadas con autenticación
import workspaceRoutes from './routes/workspace.route.js'; // Rutas relacionadas con Workspaces
import channelRoutes from './routes/channel.route.js'; // Rutas relacionadas con Channels
import messagesRoutes from './routes/message.route.js'; // Rutas relacionadas con Messages
import http from 'node:http';
import { WebSocketServer } from 'ws';
import Workspace from './models/workspace.model.js';
import Channel from './models/channel.model.js';
import Message from './models/message.model.js';
import { User } from './models/user.model.js';

// Crear una instancia de Express
const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

// Middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json({ limit: '50mb' })); // Permitir recibir y procesar JSON en el cuerpo de las solicitudes

// Rutas
app.use('/api/auth', authRoutes); // Rutas para autenticación
app.use(
  '/api/workspaces/:workspaceId/channels/:channelId/messages',
  messagesRoutes
); // Rutas para messages
app.use('/api/workspaces/:workspaceId/channels', channelRoutes); // Rutas para channels
app.use('/api/workspaces', workspaceRoutes); // Rutas para Workspaces

wss.on('connection', (ws) => {
  console.log('Un cliente se ha conectado:');

  // Escuchar evento "new message"
  ws.on('message', async (msg) => {
    console.log('Mensaje recibido:', msg);

    try {
      const { content, id_workspace, id_channel, sender } = JSON.parse(msg);

      const workspace = await Workspace.findById(id_workspace);
      if (!workspace) throw new Error('El workspace no existe');

      const channel = await Channel.findById(id_channel);
      if (!channel) throw new Error('El channel no existe');

      // Crear nuevo mensaje
      const newMessage = new Message({
        content,
        sender: sender,
        channel: id_channel
      });
      await newMessage.save();

      // Asociar mensaje a channel
      channel.messages.push(newMessage._id);
      await channel.save();

      const user = await User.findById(sender);

      // Emitir el mensaje a TODOS los clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(
            JSON.stringify({
              content: newMessage.content,
              sender: {
                _id: user._id,
                username: user.username,
                image: user.image
              },
              createdAt: newMessage.createdAt,
              _id: newMessage._id,
              id_workspace,
              id_channel
            })
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

  ws.on('close', () => {
    console.log('Un cliente se ha desconectado:', ws.id);
  });
});

export default server;
