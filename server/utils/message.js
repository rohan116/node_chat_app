var moment = require('moment');

var generateMessage = (from,text) => {
  return {
    from,
    text,
    createdBy :  moment().valueOf()
  }
};

var generateLocationMessage = (from,latitude,longitude) => {
  return {
    from,
    url : 'https://www.google.com/maps?q='+latitude+','+longitude,
    createdBy : moment().valueOf()
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage
};
