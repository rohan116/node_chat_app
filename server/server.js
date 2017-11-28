const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage,generateLocationMessage} = require('./utils/message.js')
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
  socket.emit('newMessage',generateMessage("Admin","Welcome to chat app"));
  socket.broadcast.emit('newMessage',generateMessage("Admin","New User joined"));

  socket.on('createMessage',(data,callback) => {
    io.emit('newMessage',generateMessage(data.from,data.text));
    callback();
  });

  socket.on('geoLocation',function(data,callback){
    io.emit('newLocationMessage',generateLocationMessage('User',data.latitude,data.longitude));
    callback();
  });

  socket.on('typing',function(data){
    socket.broadcast.emit('typingMessage',data);
  })


  socket.on('disconnect',() => {
    io.emit('newMessage',generateMessage("Admin","User Disconnected"));
    console.log('User Disconnected');
  });
});

server.listen(port,() => {
  console.log('Server running on port ' +port);
});
