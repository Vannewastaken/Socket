const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite conexiones desde cualquier origen (CORS)

// Configura una ruta raíz para HTTP
app.get('/', (req, res) => {
  res.send('Servidor WebSocket activo. ¡Listo para conexiones!');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Asegura que las conexiones de Angular sean aceptadas
  },
});

// Configurar eventos de WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('verificarAsistencia', (data) => {
    console.log('Asistencia verificada para:', data.username);
    io.emit('notificacionAsistencia', {
      mensaje: `Tu asistencia al evento "${data.evento}" ha sido verificada.`,
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket corriendo en http://localhost:${PORT}`);
});

