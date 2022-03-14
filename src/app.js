const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.port || 3000;
app.use(express.static('./public'));

io.on('connection', () => {
  console.log('New WebSocket connection');
});

server.listen(3000, () => {   
  console.log(`Server is up on port ${port}`);
});
