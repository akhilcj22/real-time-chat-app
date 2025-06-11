# 💬 Real-Time Chat Application

A real-time messaging platform built with **Node.js**, **Socket.io**, and **MongoDB**, featuring secure user authentication, end-to-end encryption, emoji reactions, channel-based group chats, and desktop/mobile responsiveness.

---

## 🚀 Features

- 🔐 **User Authentication**: Register and login with secure credentials.
- 💬 **Real-Time Messaging**: Instant message delivery using Socket.io.
- 🧵 **Multi-Channel Support**: Join different chat rooms like `#general`, `#random`, `#tech`.
- 😊 **Emoji Reactions**: React to messages with emojis and send emoji shortcodes like `:smile:`.
- 🔔 **Browser Notifications**: Receive push notifications when new messages arrive.
- 🧠 **Message History**: View previous messages when you enter a channel.
- 🔒 **End-to-End Encryption**: Messages are AES-encrypted client-side for privacy.
- 📱 **Responsive Design**: Works smoothly on both desktop and mobile.
- 🧩 **Modular Backend**: Clean and modular API and Socket handlers.

---

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Real-Time Communication**: Socket.io
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Token (JWT)
- **Encryption**: CryptoJS
- **Notifications**: Web Notification API
- **Development Tools**: Visual Studio Code

---

## 📁 Project Structure

real-time-chat-app/
│
├── public/ # Frontend files
│ ├── index.html
│ ├── style.css
│ └── script.js
│
├── server/ # Backend
│ ├── models/ # Mongoose models
│ │ ├── User.js
│ │ └── Message.js
│ ├── routes/ # Auth routes
│ │ └── auth.js
│ ├── db.js # MongoDB connection
│ ├── index.js # Main server file
│ └── .env # Environment variables
│
├── package.json
└── README.md

Install dependencies: npm install
Start the server: node index.js

📌 Future Improvements
✅ Message search functionality
📎 File and media sharing
📱 Progressive Web App (PWA) support
📤 Deploy on platforms like Render/Heroku/Vercel

