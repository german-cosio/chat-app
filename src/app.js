const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.port || 3000;
app.use(express.static('./public'));

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', ( { username, room } ) => {
    socket.join(room);
    socket.emit('message', generateMessage(`Welcome to ${room}`));
    socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`));
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if(filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }
    io.emit('message', generateMessage(message));
  });

  socket.on('sendLocation', (location, callback) => {
    // socket.broadcast.emit('locationMessage', `https://google.com/maps?q=${location.latitude},${location.longitude}`);
    const url = `https://google.com/maps?q=${location.latitude},${location.longitude}`;
    io.emit('locationMessage', generateLocationMessage(url));
    callback('Location shared!');
  });
  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left!'));
    // io.emit('message', generateMessage(`${username} has left.`))
    // socket.broadcast.to(room).emit('message', generateMessage(`${username} has left.`));
  });
  });

server.listen(3000, () => {   
  console.log(`Server is up on port ${port}`);
});
