var express = require('express');
var app = express();
var socketio = require('socket.io');
var server = app.listen(3000);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/public'));
var wireCountArray = [0,0,0,0,0];

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
  updateRoomCount(null, socket.room);
  socket.on('disconnect', function(){
	updateRoomCount(socket.room, null);
    console.log('user disconnected');
  });
  //Changes wire, triggered by client call.
  socket.on('change wire', function(newroom) {
	updateRoomCount(socket.room, newroom);
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

function updateRoomCount(oldRoom, newRoom) {
	switch (oldRoom) {
    case 'Alfa':
        wireCountArray[0]--;
        break;
    case 'Bravo':
        wireCountArray[1]--;
        break;
    case 'Charlie':
        wireCountArray[2]--;
        break;
    case 'Delta':
        wireCountArray[3]--;
        break;
    case 'Echo':
        wireCountArray[4]--;
        break;
	}
	switch (newRoom) {
    case 'Alfa':
        wireCountArray[0]++;
        break;
    case 'Bravo':
        wireCountArray[1]++;
        break;
    case 'Charlie':
        wireCountArray[2]++;
        break;
    case 'Delta':
        wireCountArray[3]++;
        break;
    case 'Echo':
        wireCountArray[4]++;
        break;
	return;
	}
	io.emit('table update', wireCountArray);
}

