# chatbot-using-together-ai-deepseek# 🤖 DeepSeek AI Chatbot (TogetherAI + Socket.IO + Expressjs / React)

Un chatbot full-stack en temps réel utilisant le modèle `deepseek-ai/DeepSeek-V3` de [TogetherAI](https://www.together.ai/), avec streaming mot par mot, design moderne et typage TypeScript.

---

## 📸 Démo

https://res.cloudinary.com/digybqksh/image/upload/v1752187282/Screenshot_From_2025-07-10_23-40-55_atgb6a.png

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
