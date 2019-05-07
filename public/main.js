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
    var $usericonInput = $('.usericonInput')
    var $submit = $('.userinfo'); // Input message input box

    var $loginPage = $('.login.page'); // The login page
    var $gamePage = $('.game.page'); // The chatroom page
    var $winPage = $('.win.page');
    var username;
    var usericon;
    
    var bomb = document.createElement("IMG");
    bomb.alt = "bomb";
    bomb.setAttribute('class', 'bomb');
    bomb.src="/images/mine.png";
    console.log(bomb);

    var flag = document.createElement("IMG");
    flag.alt = "flag";
    flag.setAttribute('class', 'flag');
    flag.src="/images/flag.png";
    console.log(flag);

    //Initialize canvas and grid
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    //draw the cell on canvas
    Cell.prototype.show = function() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.w, this.w);
      ctx.strokeStyle = 'white';
      ctx.stroke();
      ctx.closePath;
      if (this.revealed) {
        if (this.mine) {
          ctx.drawImage(bomb, this.x, this.y,this.w, this.w);
        } else {
          ctx.beginPath();
          ctx.rect(this.x, this.y, this.w, this.w);
          ctx.fillStyle = 'rgb(177, 177, 177)';
          ctx.fill();
          ctx.closePath();
          if (this.neighborCount > 0) {
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = '30px Montserrat'
            ctx.fillText(this.neighborCount, this.x + this.w * 0.5, this.y + this.w*0.75); 
          }
        }
      }else if(this.flagged){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.w);
        ctx.fillStyle = 'rgb(177, 177, 177)';
        ctx.fill();
        ctx.closePath();
        ctx.drawImage(flag, this.x, this.y,this.w *0.9, this.w*0.9);
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

    $submit.click(function(){
      console.log('clicked');
      username = cleanInput($usernameInput.val().trim());
      usericon = cleanInput($usericonInput.val().trim());
      // If the username is valid
      if (username) {

        var newUser = {
          name: username,
          icon: usericon
        };

        // Tell the server your username and your gameboard
        socket.emit('add user', newUser);
      }
    });

    socket.on('icon failed', () => {
      console.log('not found')
      $loginPage.append( "<p>Please try another keyword</p>");
    })

    socket.on('user joined', (players) => {
      $loginPage.fadeOut();
      $gamePage.show();
      $loginPage.off('click');
      $('#userState').empty();
      console.log(players)
      for (var id in players) {
        var player = players[id];
        $('#userState').append($('<li>', {id:player.username} ).text(player.username+": " + player.score));
        // flag.setAttribute('src', player.picture);
      }

    });

    socket.on('userinfo', (data) => {
      console.log(data);
      flag.setAttribute('src', data.flag);
    })


    function game(){

      canvas.addEventListener('contextmenu', function(ev) { 
        ev.preventDefault(); 
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        mineGame.rightMouse(x, y);
        var clicked = {
          x: x,
          y: y,
          button: 2,
          score: currentScore 
        };

        socket.emit('clicked', clicked);
        return false; 
      }, false);

      canvas.onmousedown = function whichButton(event){
        if(event.button == 0){
          var rect = canvas.getBoundingClientRect();
          var x = event.clientX - rect.left;
          var y = event.clientY - rect.top;
          mineGame.leftMouse(x, y);
          var clicked = {
            x: x,
            y: y,
            button: 0,
            score: currentScore 
          }
          socket.emit('clicked', clicked);
        }
      }
  
      socket.on('newClick', (data) =>{
        var newX = data.x;
        var newY = data.y;
        if(data.button == 0){
          mineGame.leftMouse(newX, newY);
        }else if(data.button == 2){
          mineGame.rightMouse(newX, newY);
        }
        
        socket.on('updateScore', (players) => {
          var arr = [];
          for (var id in players) {
            var player = players[id];
            arr.push(player);
            var text = document.getElementById(player.username);
            text.innerHTML = player.username + ": " +player.score;
          }
          if(mineGame.win()){
            $gamePage.fadeOut();
            $winPage.show();
            $gamePage.off('click');
            var scores = arr.sort(function(a, b){
              return b.score - a.score;
            });
            $('#finish').text( 'Game over! ' + scores[0].username+' won!' );
          }
        })

      })

    }

    const cleanInput = (input) => {
      return $('<div/>').text(input).html();
    }

    socket.on('state', function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < mineGame.cols; i++) {
        for (var j = 0; j < mineGame.rows; j++) {
          grid[i][j].show();
        }
      }
    });
  });