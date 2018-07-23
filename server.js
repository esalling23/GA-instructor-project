const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

app.use( express.static( path.join(__dirname, '/public') ) );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );

// Index/Default page
app.use('/', express.static( path.join(__dirname, 'public') ));

// See stored favorites
app.get('/favorite', function(req, res){
  // read data file
  const data = fs.readFileSync('./data.json');
  // Send data to the user
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

// Add a favorite
app.post('/favorite', function(req, res){

  if(!req.body.Title){
    res.send("Error");
    return
  }

  // Read current favorites
  const data = JSON.parse(fs.readFileSync('./data.json'));
  // Push the received data to the json file
  data.push({ 'Title': req.body.Title });
  // Re-write file with updated data
  fs.writeFile('./data.json', JSON.stringify(data));
  // Send back data to user
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.listen(3000, function(){
  console.log("Listening on port 3000");
});
