var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var io = require('socket.io')(http);

// Routing
app.use(express.static(path.join(__dirname, 'public')));

var players= {};
var usernum = 0;
var newgame;

//generate mine every time start the program
var cols = 10;
var rows = 10;
var mines = 10;

options = [];
var minesIndex = [];
for (var i = 0; i < cols; i++) {
  for (var j = 0; j < rows; j++) {
      options.push([i, j]);
  }
}
for (var n = 0; n < mines; n++) {
  var index = Math.floor((Math.random() * options.length));
  var choice = options[index];
  minesIndex.push(choice);
}

io.on('connection', (socket) => {
  io.emit('game', {
    cols: cols, 
    rows: rows,
    mines: mines,
    minesIndex: minesIndex
  })

  var addedUser = false;

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    socket.username = username;
    ++usernum;
    addedUser = true;

    players[socket.id] = {
      username: socket.username,
      score: 0, 
      usernum: usernum  
    }

    io.emit('user joined', players);

  });

  socket.on('clicked', (data) =>{
    var newClick = data;

    players[socket.id].score += data.score;
    // console.log(players[socket.id]);

    io.emit('newClick', newClick);
    io.emit('updateScore', players);
  })
});

setInterval(function() {
  io.emit('state');
}, 1000 / 60);


http.listen(3000, function(){
  console.log('listening on *:3000');
});