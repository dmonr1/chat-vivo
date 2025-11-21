// client.js
const socket = io(); // conecta al servidor que sirvió la página

const form = document.getElementById("form");
const input = document.getElementById("msg");
const usernameInput = document.getElementById("username");
const messages = document.getElementById("messages");

function appendMessage(payload) {
  const div = document.createElement("div");
  div.classList.add("message");
  const timeStr = payload.time || new Date().toLocaleTimeString();
  div.innerHTML = `<div class="meta"><strong>${escapeHtml(payload.user || "Anon")}</strong> · <span>${timeStr}</span></div>
                   <div class="text">${escapeHtml(payload.text)}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const user = usernameInput.value.trim() || "Anon";
  if (!text) return;
  const payload = { user, text, time: new Date().toLocaleTimeString() };
  socket.emit("chatMessage", payload);
  input.value = "";
  input.focus();
});

socket.on("chatMessage", (payload) => {
  appendMessage(payload);
});

// pequeño escape para evitar inyección HTML
function escapeHtml(unsafe) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
