const { Server } = require('socket.io');

let ioInstance;

function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  ioInstance.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
  });
}

function emitTableStatusUpdate(data) {
  if (ioInstance) {
    ioInstance.emit('tableStatusUpdate', data);
  }
}

module.exports = { initSocket, emitTableStatusUpdate };
