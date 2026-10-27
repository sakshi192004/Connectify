# Prompts.md

## Goal
Build a real-time chat application with React, Node.js, Express, and Socket.io.

## Prompt strategy
1. Explain client/server communication, HTTP, WebSockets, and Socket.io from beginner level.
2. Create a basic Express + Socket.io server and explain the connection lifecycle.
3. Connect React with socket.io-client and clean up listeners on unmount.
4. Add username-based messages and typing indicators.
5. Add General and Tech Support rooms with room-only broadcasting.
6. Review CORS, reconnection, room isolation, and two-browser testing.
7. Prepare deployment instructions and a QA checklist.

## Verification
Review and test the code locally with two browser instances. Confirm messages and typing indicators work and messages do not cross room boundaries. Never commit `.env` secrets.
