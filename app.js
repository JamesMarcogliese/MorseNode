var express = require('express');
var app = express();
var socketio = require('socket.io');
var server = app.listen(3000);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/public'));

//Sets up dir for static file retrieval.
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});
//On connection to socket, join default room.
io.sockets.on('connection', function(socket){
  socket.room = 'Alfa';
  socket.join('Alfa');
  console.log('user connected.');
  console.log('Joined room: ' + socket.room);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  //Changes wire, triggered by client call.
  socket.on('change wire', function(newroom) {
	socket.leave(socket.room);
	socket.room = newroom;
	socket.join(newroom);
	console.log('Changed room to: ' + newroom);
  });
  //Sends signal to other users in room/wire.
  socket.on('send morse signal', function(msg){
	socket.broadcast.to(socket.room).emit('receive morse signal', msg);
	console.log(msg.room);
	console.log('message: ' + msg);
  });
});

