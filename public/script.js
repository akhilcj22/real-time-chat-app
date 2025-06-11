let socket;
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
let currentUser = null;
let currentChannel = "general"; // default channel
const notificationSound = new Audio("/sounds/ping.mp3");

const emojiMap = {
  ":smile:": "😄",
  ":laugh:": "😂",
  ":heart:": "❤️",
  ":thumbsup:": "👍",
  ":clap:": "👏",
  ":fire:": "🔥",
  ":sad:": "😢",
};

function parseEmojis(text) {
  return text.replace(/:\w+:/g, (match) => emojiMap[match] || match);
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[char];
  });
}

function requestNotificationPermission() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

function maybeShowBrowserNotification(msg) {
  if (document.hidden && Notification.permission === "granted") {
    new Notification(`${msg.username}`, {
      body: msg.text,
      icon: "/chat-icon.png",
    });
  }
}

function initializeSocket() {
  socket = io();

  currentChannel = document.getElementById("channel-select").value;
  socket.emit("joinChannel", currentChannel);

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  document.getElementById("channel-select").addEventListener("change", () => {
    currentChannel = document.getElementById("channel-select").value;
    socket.emit("joinChannel", currentChannel);
  });

  socket.on("messageHistory", (messages) => {
    chatBox.innerHTML = "";
    messages.forEach(displayMessage);
  });

  socket.on("receiveMessage", (msg) => {
    if (msg.channel === currentChannel) {
      displayMessage(msg);
      if (msg.username !== currentUser) {
        notificationSound.play().catch((e) => console.warn("Sound blocked:", e));
        maybeShowBrowserNotification(msg);
      }
    }
  });

  socket.on("updateMessageReaction", ({ messageId, reactions }) => {
    fetchMessages(); // re-fetch all messages for now
  });

  requestNotificationPermission();
}

function sendMessage() {
  const message = input.value.trim();
  if (message && currentUser && currentChannel) {
    socket.emit("sendMessage", {
      username: currentUser,
      text: parseEmojis(message),
      channel: currentChannel,
    });
    input.value = "";
  }
}

function addReactionUI(messageId) {
  const emojis = ["😀", "❤️", "👍"];
  const reactionDiv = document.createElement("div");
  reactionDiv.className = "emoji-reactions";

  emojis.forEach((emoji) => {
    const btn = document.createElement("button");
    btn.textContent = emoji;
    btn.onclick = () => {
      socket.emit("reactToMessage", {
        messageId,
        emoji,
        username: currentUser,
      });
    };
    reactionDiv.appendChild(btn);
  });

  return reactionDiv;
}

function displayMessage(msg) {
  const messageElement = document.createElement("div");
  messageElement.className = "chat-message";
  messageElement.innerHTML = `<strong>${escapeHTML(msg.username)}</strong>: ${parseEmojis(escapeHTML(msg.text))}`;
  messageElement.appendChild(addReactionUI(msg._id || msg.id || "unknown")); // fallback for missing ID

  if (msg.reactions) {
    msg.reactions.forEach((r) => {
      const span = document.createElement("span");
      span.textContent = `${r.emoji} (${r.users.length})`;
      messageElement.appendChild(span);
    });
  }

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function fetchMessages() {
  socket.emit("requestMessageHistory", currentChannel);
}

function register() {
  fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: document.getElementById("reg-username").value,
      email: document.getElementById("reg-email").value,
      password: document.getElementById("reg-password").value,
    }),
  })
    .then((res) => res.json())
    .then((data) => alert(data.msg));
}

function login() {
  fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("login-email").value,
      password: document.getElementById("login-password").value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        currentUser = data.username;
        alert("Login successful");
        showChatUI();
        initializeSocket();
      } else {
        alert(data.msg);
      }
    });
}

function showChatUI() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("chat-section").style.display = "block";
}
