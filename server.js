// server.js
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// servir archivos estáticos desde /public
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // recibir mensaje del cliente y reenviarlo a todos
  socket.on("chatMessage", (payload) => {
    // payload puede ser { user, text, time }
    io.emit("chatMessage", payload);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3500;
http.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
