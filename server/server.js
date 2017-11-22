const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

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
  socket.emit('newMessage',{
    from : "admin",
    text : "Welcome to chat room"
  });
  socket.broadcast.emit('newMessage',{
    from : "admin",
    text : "New User Joined"
  });

  socket.on('createMessage',(data) => {
    io.emit('newMessage',{
      from : data.from,
      text : data.text,
      createdBy : new Date().getTime()
    })
  });

  socket.on('disconnect',() => {
    console.log('User Disconnected');
  });
});

server.listen(port,() => {
  console.log('Server running on port ' +port);
});
