const path = require('path');
const express = require('express');
var publicPath = path.join(__dirname,'/../public');
const port = process.ENV.port || 3000;
console.log(publicPath);
var app = express();

// app.get('/',(req,res) => {
//   res.send('publicPath/index.html');
// })

app.use(express.static(publicPath));

app.listen(port,() => {
  console.log('Server running on port ' +port);
})
