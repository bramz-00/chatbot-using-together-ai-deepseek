# chatbot-using-together-ai-deepseek# 🤖 DeepSeek AI Chatbot (TogetherAI + Socket.IO + React)

Un chatbot full-stack en temps réel utilisant le modèle `deepseek-ai/DeepSeek-V3` de [TogetherAI](https://www.together.ai/), avec streaming mot par mot, design moderne et typage TypeScript.

---

## 📸 Démo

> _Ajoute une capture d’écran ou un GIF ici pour montrer le chatbot en action_

---

## 🚀 Fonctionnalités

- ✅ Réponses en temps réel (streaming token par token)
- ✅ Modèle LLM `DeepSeek-V3` via TogetherAI
- ✅ Interface moderne (React + Tailwind + ShadCN UI)
- ✅ Indicateur de "bot en train d’écrire"
- ✅ WebSocket avec Socket.IO
- ✅ TypeScript pour le frontend

---

## 🧱 Stack technique

| Côté      | Techs principales                                               |
|-----------|-----------------------------------------------------------------|
| Backend   | Node.js, Express, Socket.IO, TogetherAI SDK                     |
| Frontend  | React, Vite, TypeScript, TailwindCSS, ShadCN UI                 |
| Modèle IA | `deepseek-ai/DeepSeek-V3` via [TogetherAI](https://together.ai) |

---

## 📁 Structure du projet

```
chatbot-using-together-ai-deepseek/
├── client/       # Frontend React + Vite (TS + Tailwind + ShadCN)
├── server/       # Backend Express + Socket.IO + TogetherAI
└── README.md     # Ce fichier
```

---

## 📦 Installation & Lancement

### 1. Cloner le dépôt

```bash
git clone https://github.com/bramz-00/chatbot-using-together-ai-deepseek.git
cd chatbot-using-together-ai-deepseek
```

---

### 2. Lancer le backend (`/server`)

```bash
cd server
npm install
```

Créer un fichier `.env` :

```env
TOGETHER_API_KEY=sk-votre-clé-api-together
```

Puis démarrer le serveur :

```bash
npm start
```

Backend dispo sur : `http://localhost:3000`

---

### 3. Lancer le frontend (`/client`)

```bash
cd client
npm install
npm run dev
```

Frontend dispo sur : `http://localhost:5173`

---

## ⚙️ Exemple backend (`server/index.js`)

```js
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
  cors: { origin: '*' },
});

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

io.on('connection', (socket) => {
  console.log('🟢 Client connecté');

  socket.on('user_message', async (userMessage) => {
    try {
      const response = await together.chat.completions.create({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [{ role: 'user', content: userMessage }],
        stream: true,
      });

      for await (const chunk of response) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) socket.emit('bot_message', content);
      }

      socket.emit('done');
    } catch (err) {
      socket.emit('error_message', 'Erreur de génération IA.');
    }
  });
});

server.listen(3000, () => {
  console.log('✅ Serveur lancé sur http://localhost:3000');
});
```

---

## 💬 Exemple frontend (`client/src/App.tsx`)

```tsx
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const socket: Socket = io("http://localhost:3000");

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const botBuffer = useRef("");

  useEffect(() => {
    socket.on("bot_message", (token: string) => {
      setIsTyping(true);
      botBuffer.current += token;
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: botBuffer.current };
        return updated;
      });
    });

    socket.on("done", () => {
      setIsTyping(false);
      botBuffer.current = "";
    });

    socket.on("error_message", (err: string) => {
      setChat((prev) => [...prev, { sender: "bot", text: err }]);
    });

    return () => {
      socket.off("bot_message");
      socket.off("done");
      socket.off("error_message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat((prev) => [
      ...prev,
      { sender: "user", text: message },
      { sender: "bot", text: "" },
    ]);
    socket.emit("user_message", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">🤖 DeepSeek Chatbot</h1>

        <Card className="h-[500px] overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4 space-y-2 overflow-y-auto">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-sm text-gray-500 italic">Le bot écrit...</div>
            )}
          </ScrollArea>
          <CardContent className="p-4 border-t flex items-center gap-2">
            <Input
              placeholder="Tape ton message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={isTyping}>
              {isTyping ? <Loader2 className="animate-spin w-4 h-4" /> : "Envoyer"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
```

---

## 🛠️ Suggestions d'amélioration

- 🧠 Chat avec mémoire/contextes longs
- 🗃️ Historique sauvegardé (localStorage ou base de données)
- 💬 Support Markdown avec blocs de code
- 🌙 Dark mode toggle
- 🔐 Authentification (Clerk, Firebase, etc.)
- ☁️ Déploiement sur Vercel, Railway ou Render

---

## 📜 Licence

MIT © [bramz-00](https://github.com/bramz-00)

---

## 🙋 Besoin d'aide ou envie de contribuer ?

- Fork le repo et propose une PR
- Ouvre une issue si tu veux ajouter une feature
- Contacte-moi directement si tu veux apprendre à déployer
