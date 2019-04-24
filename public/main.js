var cols;
var rows;
var width;
var grid;
var clickedCell;
var mines;
var minesIndex = [];
var currentScore = 0;

$(function() {

    var socket = io();
    // Initialize variables
    var $window = $(window);
    var $usernameInput = $('.usernameInput'); // Input for username
    var $inputMessage = $('.inputMessage'); // Input message input box

    var $loginPage = $('.login.page'); // The login page
    var $gamePage = $('.game.page'); // The chatroom page

    var username;
    var $currentInput = $usernameInput.focus();

    //Initialize canvas and grid
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    //draw the cell on canvas
    Cell.prototype.show = function() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.w, this.w);
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.closePath;
      if (this.revealed) {
        if (this.mine) {
          ctx.beginPath();
          ctx.rect(this.x, this.y, this.w, this.w);
          ctx.fillStyle = 'red';
          ctx.fill();
          ctx.closePath();
        } else {
          ctx.beginPath();
          ctx.rect(this.x, this.y, this.w, this.w);
          ctx.fillStyle = 'gray';
          ctx.fill();
          ctx.closePath();
          if (this.neighborCount > 0) {
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(this.neighborCount, this.x + this.w * 0.5, this.y + this.w - 6); 
          }
        }
      }
    }

    //create gameboard
    socket.on('game', (data) => {
      cols = data.cols;
      rows = data.rows;
      mines = data.mines;
      for(var i = 0; i<data.minesIndex.length; i ++){
        minesIndex.push(data.minesIndex[i]);
      }
      width = canvas.width/cols;

      mineGame = new Mine(cols, rows, mines, minesIndex);
      game();
    })


    //login page
    //Sets the client's username
    //enter chat page after gets username
    const setUsername = () => {
      username = cleanInput($usernameInput.val().trim());

      // If the username is valid
      if (username) {
        $loginPage.fadeOut();
        $gamePage.show();
        $loginPage.off('click');
        $currentInput = $inputMessage.focus();

        // Tell the server your username and your gameboard
        socket.emit('add user', username);
      }
    }

    socket.on('user joined', (players) => {
      $('#userState').empty();
      // currentScore = player.score;
      // console.log(data.data);
      for (var id in players) {
        var player = players[id];
        $('#userState').append($('<li>', {id:player.username} ).text(player.username+": " + player.score));
      }
    });


    function game(){
      canvas.onclick = function reveal(event){
        var x = event.clientX;
        var y = event.clientY;
        mineGame.leftMouse(x, y);
        var clicked = {
          x: x,
          y: y,
          score: currentScore 
        }
        socket.emit('clicked', clicked);
      }
  
      socket.on('newClick', (data) =>{
        var newX = data.x;
        var newY = data.y;
        mineGame.leftMouse(newX, newY);
        socket.on('updateScore', (players) => {
          for (var id in players) {
            var player = players[id];
            var text = document.getElementById(player.username);
            text.innerHTML = player.username + ": " +player.score;
          }
        })
      })

    }

    // Focus input when clicking anywhere on login page
    $loginPage.click(() => {
      $currentInput.focus();
    });

    const cleanInput = (input) => {
      return $('<div/>').text(input).html();
    }

    $window.keydown(event => {
      // Auto-focus the current input when a key is typed
      if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        $currentInput.focus();
      }
      // When the client hits ENTER on their keyboard
      if (event.which === 13) {
          setUsername();
      }
    });

    socket.on('state', function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < mineGame.cols; i++) {
        for (var j = 0; j < mineGame.rows; j++) {
          grid[i][j].show();
        }
      }
    });
  });