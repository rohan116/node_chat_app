var generateMessage = (from,text) => {
  return {
    from,
    text,
    createdBy :  new Date().getTime()
  }
};

var generateLocationMessage = (from,latitude,longitude) => {
  return {
    from,
    url : 'https://www.google.com/maps?q='+latitude+','+longitude,
    createdBy : new Date().getTime()
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage
};
