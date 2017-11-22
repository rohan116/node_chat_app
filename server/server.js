const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage} = require('./utils/message.js')
var publicPath = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;
//console.log(publicPath);
var app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('New User connected');

  //New User Joined (Message from admin and broadcast to others that a new user joined)
  socket.emit('newMessage',generateMessage("admin","Welcome to chat app"));
  socket.broadcast.emit('newMessage',generateMessage("admim","New User joined"));

  socket.on('createMessage',(data) => {
    io.emit('newMessage',generateMessage(data.from,data.text));
  });

  socket.on('disconnect',() => {
    console.log('User Disconnected');
  });
});

server.listen(port,() => {
  console.log('Server running on port ' +port);
});
