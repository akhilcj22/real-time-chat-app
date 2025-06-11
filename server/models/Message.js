const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  channel: { type: String, required: true }, // 👈 New field
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
