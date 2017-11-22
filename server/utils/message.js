var generateMessage = (from,text) => {
  return {
    from,
    text,
    createdBy :  new Date().getTime()
  }
};

module.exports = {generateMessage};
