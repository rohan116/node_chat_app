const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const {generateMessage,generateLocationMessage} = require('./utils/message.js')
var publicPath = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;
//console.log(publicPath);
var app = express();

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('New User connected');

  //New User Joined (Message from admin and broadcast to others that a new user joined)

  socket.on('join',(params,callback) => {
      if(!isRealString(params.name) || !isRealString(params.room))
      {
        return callback('Name and room are mandatory');
      }
      socket.join(params.room.toUpperCase());
      users.removeUser(socket.id);
      users.addUser(socket.id,params.name,params.room);

      io.to(params.room.toUpperCase()).emit('updateUserList',users.getUserList(params.room));
      socket.emit('newMessage',generateMessage("Admin","Welcome to chat app"));
      socket.broadcast.to(params.room.toUpperCase()).emit('newMessage',generateMessage("Admin",`${params.name} has joined`));
      callback();
  });

  socket.on('createMessage',(data,callback) => {
    var user = users.getUser(socket.id);
    if(user){
        io.to(user.room.toUpperCase()).emit('newMessage',generateMessage(user.name,data.text));
    }
    callback();
  });

  socket.on('geoLocation',function(data,callback){
    var user = users.getUser(socket.id);
    if(user){
        io.to(user.room.toUpperCase()).emit('newLocationMessage',generateLocationMessage(user.name,data.latitude,data.longitude));
    }
    callback();
  });

  socket.on('typing',function(data){
    socket.broadcast.emit('typingMessage',data);
  })


  socket.on('disconnect',() => {
    var user = users.removeUser(socket.id);
    console.log(user);
    if(user){
      io.to(user.room.toUpperCase()).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room.toUpperCase()).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
    }
  });
});

server.listen(port,() => {
  console.log('Server running on port ' +port);
});
