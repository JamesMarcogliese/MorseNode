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
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('morse signal', function(msg){
	socket.broadcast.emit('morse signal', msg);
    //io.emit('morse signal', msg);
	console.log('message: ' + msg);
  });
});

var rooms = ['room1','room2','room3','room4','room5','room6'];

