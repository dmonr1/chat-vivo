const socket = io();

const form = document.getElementById("form");
const username = document.getElementById("username");
const msg = document.getElementById("msg");
const messages = document.getElementById("messages");

let myName = "";

// Actualiza el nombre
username.addEventListener("change", () => {
  myName = username.value.trim();
});

// Enviar con Enter
msg.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = msg.value.trim();
  const user = username.value.trim() || "Anon";

  if (!text) return;

  myName = user;

  const payload = {
    username: user,
    message: text
  };

  socket.emit("chat-message", payload);

  msg.value = "";
  msg.focus();
});

// Recibir mensaje del servidor
socket.on("chat-message", (payload) => {
  const box = document.createElement("div");
  box.classList.add("message");

  if (payload.username === myName) {
    box.classList.add("sent");
  } else {
    box.classList.add("received");
  }

  const name = document.createElement("div");
  name.classList.add("username");
  name.textContent = payload.username;

  const text = document.createElement("div");
  text.classList.add("text");
  text.textContent = payload.message;

  box.appendChild(name);
  box.appendChild(text);

  messages.appendChild(box);
  messages.scrollTop = messages.scrollHeight;
});
