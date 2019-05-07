var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var io = require('socket.io')(http);

process.env.PWD = process.cwd()
app.use(express.static(process.env.PWD + '/public'));

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// connect to noun project
var config = require('./config.js');
var KEY = config.key;
var SECRET = config.secret;
var OAuth = require('oauth')

var oauth = new OAuth.OAuth(
	'http://api.thenounproject.com',
	'http://api.thenounproject.com',
	KEY,
	SECRET,
	'1.0',
	null,
	'HMAC-SHA1'
)

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));

var players= {};
var usernum = 0;

//generate mine every time start the program
var cols = 10;
var rows = 10;
var mines = 2;

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
    minesIndex: minesIndex, 
    usernum: usernum
  })

  var addedUser = false;

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (newUser) => {
    if (addedUser) return;
    console.log(newUser.icon);
    const iconkey = newUser.icon;
    oauth.get(
    `http://api.thenounproject.com/icon/${iconkey}`,
    null,
    null,
    function (err, body, respond){
      if(err){
        console.log(err);
        // var userlog = {
        //   error: err
        // }
        io.emit('icon failed')
      }else{
        let info = JSON.parse(body);

        socket.username = newUser.name;
        ++usernum;
        addedUser = true;

        players[socket.id] = {
          username: socket.username,
          score: 0, 
          usernum: usernum, 
          flag: info.icon.preview_url  
        }
        io.emit('user joined', players);
        socket.emit('userinfo', players[socket.id])
        
      }
    }
  )
});

  socket.on('clicked', (data) =>{
    var newClick = data;
    newClick.picture = players[socket.id].flag;
    console.log(newClick);

    players[socket.id].score += data.score;
    // console.log(players[socket.id]);

    io.emit('newClick', newClick);
    io.emit('updateScore', players);
  });

  socket.on('disconnect', function () {
    delete players[socket.id];
});
});

setInterval(function() {
  io.emit('state');
}, 1000 / 60);


http.listen(3000, function(){
  console.log('listening on *:3000');
});