var socket = io();
function scrollAutomatically(){
  //Selectors
  var messages =  jQuery("#olTag");
  var newMessage = messages.children('li:last-child');
  //Height
  var clientheight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientheight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
    //console.log('scroll kar');
  }

}

socket.on('connect' ,function() {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join',params,function(err){
    if(err){
        alert('Name and room are mandatory');
        window.location.href = '/';
    }
    else{

    }
  });
});

socket.on('disconnect',function() {
  console.log('Disconnected from the server')
});

// socket.on('newEmail',function(data){
//   console.log(data);
// });
function isRealStringData(str){
  return typeof str === "string" && str.trim().length > 0
}
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

//Update user list
socket.on('updateUserList',function(users){
  console.log(users);
  var ol = jQuery('<ol></ol>');

  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  })

  jQuery("#users").html(ol);
})

socket.on('newMessage',function(data){
  var formattedTime = moment(data.createdBy).format('h:mm a');
  var template = jQuery("#message_template").html();
  var html = Mustache.render(template,{
    from : data.from,
    text : data.text,
    createdBy : formattedTime
  });
  jQuery("#olTag").append(html);
  scrollAutomatically();

  //Old Way to render page
  // var formattedTime = moment(data.createdBy).format('h:mm a');
  // var li = jQuery('<li></li>');
  // li.text(`${data.from} ${formattedTime} : ${data.text}`);
  //
  // jQuery('#olTag').append(li);
});

socket.on('newLocationMessage',function(message){
  var time = moment(message.createdBy).format('h:mm a');
  var template = jQuery("#location_message_template").html();
  console.log(template);
  var html = Mustache.render(template,{
    from : message.from,
    url : message.url,
    createdBy : time
  })
  jQuery('#olTag').append(html);
  scrollAutomatically();

  //old render technique
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My Current Location</a>');
  //
  // li.text(message.from + " " +time+ " : ");
  // a.attr('href',message.url);
  // li.append(a);
  //jQuery('#olTag').append(li);
});

jQuery('#message_form').on('submit',function(e) {
  e.preventDefault();
  var textboxValue = jQuery("#textbox").val();
  console.log(isRealStringData(textboxValue));
  if(isRealStringData(textboxValue)){
    socket.emit('createMessage',{
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
send_location.attr('disabled','disabled').text('Sending Location...');
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
