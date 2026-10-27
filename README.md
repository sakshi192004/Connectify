# Connectify — Real-Time Chat

React + Node.js + Express + Socket.io chat project for Sprint 12.

## Run locally

Terminal 1:
```bash
cd server
npm install
npm run dev
```

Terminal 2:
```bash
cd client
npm install
npm run dev
```

Open the Vite URL (normally http://localhost:5173) in two browser windows and use different usernames. Select General or Tech Support to test room isolation.

Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env` if needed. Messages are stored in server memory only and disappear when the server restarts.
