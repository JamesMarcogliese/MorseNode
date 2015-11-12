var express = require('express');
var app = express();
var socketio = require('socket.io');
var server = app.listen(3000);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.sockets.on('connection', function(socket){
  console.log('user connected.');
  socket.on('morse signal', function(msg){
    console.log('message: ' + msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('morse signal', function(msg){
    io.emit('morse signal', msg);
  });
});

