function make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
}

var grid;
var cols;
var rows;
var w = 20;


function Mine(cols, rows, mines, minesIndex){
    this.cols = cols;
    this.rows = rows;
    this.mines = mines;

    grid = make2DArray(this.cols, this.rows);
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        grid[i][j] = new Cell(i, j, width);
      }
    }

    this.minesIndex = minesIndex
    for (var n = 0; n < this.minesIndex.length; n++) {
        var choice = this.minesIndex[n];
        var i = choice[0];
        var j = choice[1];
        grid[i][j].mine = true;
    }


    for (var i = 0; i < this.cols; i++) {
        for (var j = 0; j < this.rows; j++) {
            grid[i][j].countMines();
        }
    }
}
  
//check for win here
//need further development 
Mine.prototype.win = function () {
  var normal = 0;
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        if(!grid[i][j].mine){
          if (grid[i][j].revealed){
            normal ++;
          }
        }
      }
    }
    console.log(normal);
  if (normal == this.cols*this.rows - this.mines){
    return true;
  }
}
  
//function for click event
Mine.prototype.leftMouse = function(mouseX, mouseY) {
  for (var i = 0; i < this.cols; i++) {
    for (var j = 0; j < this.rows; j++) {
      if (grid[i][j].contains(mouseX, mouseY)) {
        if(!grid[i][j].revealed){
          grid[i][j].reveal();
          if (grid[i][j].mine) {
            currentScore = -4;
          }else{
            currentScore = 1;
          }
        }else{
          currentScore = 0;
        }
      }
    }
  }
}

Mine.prototype.rightMouse = function(mouseX, mouseY) {
  for (var i = 0; i < this.cols; i++) {
    for (var j = 0; j < this.rows; j++) {
      if (grid[i][j].contains(mouseX, mouseY)) {
        if(!grid[i][j].revealed){
          if (grid[i][j].mine) {
            if(!grid[i][j].flagged){
              currentScore = 4;
            }
            grid[i][j].flagged = true;
          } else{
            grid[i][j].revealed = true;
            currentScore = -2;
          }
        }
          
      }
    }
  }
}