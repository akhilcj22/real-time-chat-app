require("dotenv").config(); // Load .env first

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this in production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Connect to MongoDB
connectDB();

// API routes
app.use("/api/auth", authRoutes);

// Socket.io handling
io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  // Handle joining channel
  socket.on("joinChannel", async (channel) => {
    socket.join(channel);

    // Load last 50 messages from this channel
    const messages = await Message.find({ channel })
      .sort({ timestamp: 1 })
      .limit(50);
    socket.emit("messageHistory", messages);
  });

  // Handle sending messages
  socket.on("sendMessage", async (msg) => {
    const newMsg = new Message(msg);
    await newMsg.save();

    // Emit to others in the same channel
    io.to(msg.channel).emit("receiveMessage", newMsg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
