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
var timeout;
var typing;

function timeoutFunction() {
    typing = false;
    socket.emit("typing", false);
}

$('#textbox').keyup(function() {
  if(event.keyCode != 13){
    console.log('happening');
    typing = true;
    socket.emit('typing', 'typing...');
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 1000);
  }
});


  socket.on('typingMessage', function(data) {
    console.log(data);
    if (data) {
        jQuery('#temp').html(data);
    } else {
        jQuery('#temp').html("");
    }
});


socket.on('newMessage',function(data){
  var formattedTime = moment(data.createdBy).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${data.from} ${formattedTime} : ${data.text}`);

  jQuery('#olTag').append(li);
});

socket.on('newLocationMessage',function(message){
  var time = moment(message.createdBy).format('h:mm a');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current Location</a>');

  li.text(message.from + " " +time+ " : ");
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
    },function(){
       jQuery("#textbox").val('');
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
send_location.attr('disabled','disabled').text('Semding Location...');
  navigator.geolocation.getCurrentPosition(function(position){
    console.log(position);
    socket.emit('geoLocation',{
      latitude : position.coords.latitude,
      longitude : position.coords.longitude
    },function(){
      send_location.removeAttr('disabled').text('Send Location');
    })
  },function(){
    send_location.removeAttr('disabled').text('Send Location');
    alert('unable to fetch the location');
  });
});
