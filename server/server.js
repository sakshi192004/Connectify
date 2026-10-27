require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map(x => x.trim());
app.use(cors({ origin: origins }));
app.use(express.json());

const io = new Server(server, { cors: { origin: origins, methods: ["GET", "POST"] } });
const validRooms = new Set(["General", "Tech Support"]);
const history = new Map();
const users = new Map();

app.get("/", (_req, res) => res.json({ message: "Connectify server is running." }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

function sendRoomUsers(room) {
  io.to(room).emit("room_users", Array.from(users.get(room)?.values() || []));
}

io.on("connection", socket => {
  console.log("Client connected:", socket.id);

  socket.on("join_room", ({ username, room } = {}) => {
    const name = String(username || "").trim().slice(0, 24);
    const target = validRooms.has(room) ? room : "General";
    if (!name) return socket.emit("app_error", "Please enter a username.");

    for (const oldRoom of socket.rooms) {
      if (validRooms.has(oldRoom)) {
        socket.leave(oldRoom);
        users.get(oldRoom)?.delete(socket.id);
        sendRoomUsers(oldRoom);
        socket.to(oldRoom).emit("user_stop_typing", { socketId: socket.id });
      }
    }

    socket.data.username = name;
    socket.data.room = target;
    socket.join(target);
    if (!users.has(target)) users.set(target, new Map());
    users.get(target).set(socket.id, { socketId: socket.id, username: name });
    socket.emit("message_history", history.get(target) || []);
    socket.to(target).emit("system_message", { id: `${Date.now()}-${Math.random()}`, text: `${name} joined ${target}.`, createdAt: new Date().toISOString() });
    sendRoomUsers(target);
    console.log(`${name} joined ${target}`);
  });

  socket.on("send_message", raw => {
    const { username, room } = socket.data;
    const text = String(raw || "").trim().slice(0, 2000);
    if (!username || !room || !text) return;
    const message = { id: `${Date.now()}-${Math.random()}`, username, text, room, createdAt: new Date().toISOString(), type: "user" };
    if (!history.has(room)) history.set(room, []);
    history.get(room).push(message);
    if (history.get(room).length > 100) history.get(room).shift();
    io.to(room).emit("receive_message", message);
    io.to(room).emit("user_stop_typing", { socketId: socket.id });
  });

  socket.on("typing", () => {
    if (socket.data.username && socket.data.room) socket.to(socket.data.room).emit("user_typing", { socketId: socket.id, username: socket.data.username });
  });
  socket.on("stop_typing", () => {
    if (socket.data.room) socket.to(socket.data.room).emit("user_stop_typing", { socketId: socket.id });
  });
  socket.on("disconnect", () => {
    const { username, room } = socket.data;
    if (room) {
      users.get(room)?.delete(socket.id);
      sendRoomUsers(room);
      socket.to(room).emit("user_stop_typing", { socketId: socket.id });
      if (username) socket.to(room).emit("system_message", { id: `${Date.now()}-${Math.random()}`, text: `${username} left ${room}.`, createdAt: new Date().toISOString() });
    }
    console.log("Client disconnected:", socket.id);
  });
});
server.listen(PORT, () => console.log(`Connectify server listening on port ${PORT}`));
