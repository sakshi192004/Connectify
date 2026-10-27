# 💬 Connectify — Real-Time Chat Application

Connectify is a real-time chat application built using React, Node.js, Express, and Socket.io. It enables users to communicate instantly through separate chat rooms with live messaging and typing indicators.

## 🔗 Project Links

* **GitHub Repository:** [(https://github.com/sakshi192004/Connectify)]
* **Live Demo:** [(https://connectify-8eb2.vercel.app/)]
* **Demo Video:** [(https://drive.google.com/file/d/1FVDZbUn-Coi3yQmpJHMPB_DZRby0MTvQ/view?usp=sharing)]

## ✨ Features

* **Real-Time Messaging:** Send and receive messages instantly using Socket.io.
* **Username Identification:** Join the chat using a display name.
* **Typing Indicators:** See when another user is typing.
* **Multiple Chat Rooms:** Choose between General and Tech Support.
* **Room-Based Messaging:** Messages are delivered only to users in the selected room.
* **Online Connection Status:** View the connection status of the application.
* **Responsive UI:** Chat interface designed for desktop and mobile screens.
* **Message History:** Recent room messages are maintained in server memory while the server is running.

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS3
* Socket.io Client
* Lucide React

### Backend

* Node.js
* Express.js
* Socket.io
* HTTP Server
* CORS

### Development Tools

* Visual Studio Code
* Git
* GitHub
* npm

## 📁 Project Structure

```text
Connectify/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── README.md
├── Prompts.md
└── .gitignore
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

* Node.js
* npm
* Git
* Visual Studio Code

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd Connectify
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### Step 2: Configure the Backend

Open a terminal and run:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The backend should run at:

`http://localhost:5000`

### Step 3: Configure the Frontend

Open a second terminal in the project root and run:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

`http://localhost:5173`

## 🧪 How to Test

1. Open the application in a browser.
2. Enter a username.
3. Select General or Tech Support.
4. Open the same application in another browser or an Incognito window.
5. Join using a different username.
6. Send messages between the two browser instances.
7. Verify that typing indicators appear.
8. Select different rooms and confirm that messages remain isolated to their respective rooms.

## 🔄 How It Works

1. The React frontend connects to the Node.js backend using Socket.io Client.
2. The server accepts the connection and assigns a unique socket ID.
3. The user joins a selected chat room.
4. When a user sends a message, the frontend emits a Socket.io event.
5. The backend receives the message and broadcasts it to the selected room.
6. Connected clients in that room receive and display the message instantly.
7. Typing events notify other users in the same room.

## 🔐 Environment Variables

| Variable          | Description                | Example                 |
| ----------------- | -------------------------- | ----------------------- |
| `PORT`            | Backend server port        | `5000`                  |
| `CLIENT_ORIGIN`   | Allowed frontend origin(s) | `http://localhost:5173` |
| `VITE_SOCKET_URL` | Socket.io backend URL      | `http://localhost:5000` |

For production, configure the frontend and backend URLs using your hosting provider's environment variable settings.

**Important:** Never commit secret credentials or private environment files to GitHub.

## 🚀 Deployment

The project can be deployed using:

* **Frontend:** Vercel
* **Backend:** Render

After deployment, configure the frontend to use the deployed backend URL and configure the backend's allowed origins to include the deployed frontend URL.

Ensure that both services are running and the Socket.io connection works before submitting the live demo.

## 📚 Learning Outcomes

This project demonstrates practical experience with:

* React components and state management
* Node.js and Express server setup
* WebSockets and Socket.io
* Real-time, bidirectional communication
* Event-driven programming
* Socket connection lifecycle and cleanup
* Room-based message broadcasting
* Typing indicators and user presence
* Environment variables and deployment configuration

