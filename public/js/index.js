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
  var li = jQuery('<li></li>');
  li.text(`${data.from} : ${data.text}`);

  jQuery('#olTag').append(li);
});

jQuery('#message_form').on('submit',function(e) {
  e.preventDefault();

  socket.emit('createMessage',{
    from : "User",
    text : jQuery("#textbox").val()
  })
});
