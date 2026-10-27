import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { MessageCircle, Send, LogOut, Users, Wifi, WifiOff } from "lucide-react";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const ROOMS = ["General", "Tech Support"];

export default function App() {
  const [nameInput, setNameInput] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("General");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const timer = useRef(null);
  const bottom = useRef(null);

  useEffect(() => {
    if (!username) return;
    const socket = io(URL, { autoConnect: false });
    socketRef.current = socket;
    socket.on("connect", () => { setConnected(true); setError(""); socket.emit("join_room", { username, room }); });
    socket.on("disconnect", () => { setConnected(false); setTyping([]); });
    socket.on("connect_error", () => setError("Cannot connect. Check that the backend is running."));
    socket.on("app_error", setError);
    socket.on("message_history", setMessages);
    socket.on("receive_message", m => setMessages(old => [...old, m]));
    socket.on("system_message", m => setMessages(old => [...old, { ...m, type: "system" }]));
    socket.on("user_typing", u => setTyping(old => [...old.filter(x => x.socketId !== u.socketId), u]));
    socket.on("user_stop_typing", ({ socketId }) => setTyping(old => old.filter(x => x.socketId !== socketId)));
    socket.on("room_users", setRoomUsers);
    socket.connect();
    return () => { clearTimeout(timer.current); socket.removeAllListeners(); socket.disconnect(); if (socketRef.current === socket) socketRef.current = null; };
  }, [username, room]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function join(e) {
    e.preventDefault();
    const name = nameInput.trim().slice(0, 24);
    if (!name) return setError("Please enter a username.");
    setError(""); setMessages([]); setUsername(name);
  }
  function send(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !socketRef.current?.connected) return;
    socketRef.current.emit("send_message", text);
    socketRef.current.emit("stop_typing");
    clearTimeout(timer.current); setDraft("");
  }
  function changeDraft(e) {
    const value = e.target.value; setDraft(value);
    const socket = socketRef.current;
    if (!socket?.connected) return;
    if (value.trim()) {
      socket.emit("typing"); clearTimeout(timer.current);
      timer.current = setTimeout(() => socket.emit("stop_typing"), 900);
    } else socket.emit("stop_typing");
  }
  function changeRoom(next) { if (next === room) return; setMessages([]); setTyping([]); setRoomUsers([]); setRoom(next); }
  function leave() {
    clearTimeout(timer.current); socketRef.current?.disconnect(); socketRef.current = null;
    setUsername(""); setMessages([]); setDraft(""); setTyping([]); setRoomUsers([]); setConnected(false); setError("");
  }

  if (!username) return <main className="join-page"><form className="join-card" onSubmit={join}>
    <div className="logo"><MessageCircle size={25}/></div><p className="eyebrow">REAL-TIME COMMUNICATION</p>
    <h1>Say hello to <span>Connectify.</span></h1><p className="muted">A simple live chat for conversations that move in real time.</p>
    <label htmlFor="username">Your display name</label><input id="username" value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="e.g. Sakshi" maxLength={24} autoFocus/>
    <label htmlFor="room">Choose a room</label><select id="room" value={room} onChange={e => setRoom(e.target.value)}>{ROOMS.map(r => <option key={r}>{r}</option>)}</select>
    {error && <p className="error">{error}</p>}<button className="primary">Enter chat <Send size={16}/></button><p className="footnote">Powered by React and Socket.io</p>
  </form></main>;

  return <main className="layout">
    <aside className="sidebar"><div className="brand"><span className="logo small"><MessageCircle size={18}/></span>connectify<span className="purple">.</span></div>
      <p className="section-label">WORKSPACE</p><div className="workspace"><span className="workspace-icon">C</span><span><b>Community</b><small>Chat workspace</small></span></div>
      <p className="section-label channels">CHANNELS <span>02</span></p><nav className="room-list">{ROOMS.map(r => <button key={r} onClick={() => changeRoom(r)} className={room === r ? "room active" : "room"}><span>#</span>{r}{room === r && <i/>}</button>)}</nav>
      <div className="profile"><div className="avatar">{username[0].toUpperCase()}</div><div className="profile-name"><b>{username}</b><small>{connected ? "Online" : "Connecting..."}</small></div><button className="leave" onClick={leave} aria-label="Leave chat" title="Leave chat"><LogOut size={16}/></button></div>
    </aside>
    <section className="chat"><header className="chat-header"><div><h2><span>#</span> {room}</h2><p>{room === "General" ? "The place for everyday conversations." : "Ask questions and help each other out."}</p></div>
      <div className="connection"><i className={connected ? "online" : ""}/>{connected ? "Live connection" : "Connecting"}<span className="divider"/><Users size={16}/>{roomUsers.length}</div></header>
      <div className="messages"><div className="welcome"><div className="welcome-icon"><MessageCircle size={22}/></div><h3>Welcome to #{room}</h3><p>This is the beginning of the <b>{room}</b> conversation.</p></div>
        {messages.map(m => m.type === "system" ? <div className="system" key={m.id}><span/>{m.text}</div> : <article className="message" key={m.id}><div className="avatar message-avatar">{(m.username || "?")[0].toUpperCase()}</div><div><div className="meta"><b>{m.username}</b><time>{m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) : ""}</time>{m.username === username && <small>YOU</small>}</div><p>{m.text}</p></div></article>)}
        <div className="typing" aria-live="polite">{typing.filter(u => u.username !== username).map(u => u.username).join(", ")}{typing.some(u => u.username !== username) ? " is typing..." : ""}</div><div ref={bottom}/>
      </div>
      <div className="composer-wrap">{error && <p className="error">{error}</p>}<form className="composer" onSubmit={send}><input value={draft} onChange={changeDraft} placeholder={`Message #${room}`} maxLength={2000} disabled={!connected} aria-label="Write a message"/><button className="send" disabled={!connected || !draft.trim()} aria-label="Send message"><Send size={17}/></button></form>
        <div className="composer-footer"><span>Be kind. Keep conversations helpful.</span><span>{connected ? <><Wifi size={13}/> Connected</> : <><WifiOff size={13}/> Reconnecting</>}</span></div>
      </div>
    </section>
  </main>;
}
