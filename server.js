const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Permitir conexiones desde cualquier origen (Angular, Ionic, etc.)
  },
});

// Evento de conexión de WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Evento cuando un gestor escanea un QR
  socket.on('qrEscaneado', (data) => {
    console.log(`QR escaneado: ${data.username} - Evento: ${data.evento}`);
    
    // Reenvía la notificación a todos los asistentes conectados
    io.emit('notificacionQR', {
      mensaje: `Tu asistencia al evento "${data.evento}" ha sido verificada.`,
      username: data.username,
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket corriendo en http://localhost:${PORT}`);
});
