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

socket.on('newLocationMessage',function(message){
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current Location</a>');

  li.text(message.from + ":");
  a.attr('href',message.url);
  li.append(a);
  jQuery('#olTag').append(li);
});

jQuery('#message_form').on('submit',function(e) {
  e.preventDefault();
  var textboxValue = jQuery("#textbox").val()
  if(textboxValue.length>0){
    socket.emit('createMessage',{
      from : "User",
      text : textboxValue
    })
  }
  else{
    alert('Cannot send empty message');
  }

});

var send_location = jQuery("#send_Location");
send_location.on('click',function(){
  if(!navigator.geolocation){
    return alert('Browser doesnt support geolocation')
  }

  navigator.geolocation.getCurrentPosition(function(position){
    console.log(position);
    socket.emit('geoLocation',{
      latitude : position.coords.latitude,
      longitude : position.coords.longitude
    })
  },function(){
    alert('unable to fetch the location');
  });
});
