import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Together } from 'together-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // autorise tout (sécurise + tard)
  },
});

app.use(cors());

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

io.on('connection', (socket) => {
  console.log('🟢 Client connected');

  socket.on('user_message', async (userMessage) => {
    console.log('🔹 Message reçu:', userMessage);

    try {
      const response = await together.chat.completions.create({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [{ role: 'user', content: userMessage }],
        stream: true,
      });

      for await (const chunk of response) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) {
          socket.emit('bot_message', content); // stream token by token
        }
      }

      socket.emit('done'); // fin de la réponse
    } catch (err) {
      console.error('❌ Erreur IA:', err);
      socket.emit('error_message', 'Erreur IA');
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur Socket.IO prêt sur http://localhost:${PORT}`);
});
