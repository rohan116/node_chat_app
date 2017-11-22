var socket = io();
socket.on('connect' ,function() {
  console.log('Connected to server')
});

socket.on('disconnect',function() {
  console.log('Disconnected from the server')
});

// socket.on('newEmail',function(data){
//   console.log(data);
// });

socket.on('newMessage',function(data){
  console.log(data);
});
