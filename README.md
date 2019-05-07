# Multi-player Minesweeper
## About
This is a basic multi-player minesweeper game. It is built using express, and socket.io is used for real-time communications. The game is also connected to [Noun Project](https://thenounproject.com/) to get unique icon for each player.

## Game Logic
Unlike traditional minesweeper, this game is more of a competition between players. If you reveal the normal cell, it will add one point to your score; if you flag the mine correctly, four points will be added; if you flag wrong, two points will be deducted; but if you click on the mine, four points will be deducted.

If every cell other than mines is revealed, game will be over and whoever has higher score will win.

## How to install


