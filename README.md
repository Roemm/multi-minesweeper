# Multi-player minesweeper
## About
This is a basic multi-player minesweeper game. It is built using express, and socket.io is used for real-time communications. The game is also connected to [Noun Project](https://thenounproject.com/) to get unique icon for each player.

## Game logic
Unlike traditional minesweeper, this game is more of a competition between players. If you reveal the normal cell, it will add one point to your score; if you flag the mine correctly, four points will be added; if you flag wrong, two points will be deducted; but if you click on the mine, four points will be deducted.

If every cell other than mines is revealed, game will be over and whoever has higher score will win.

## How to install
To install this game and play it locally, first make sure you have node.js installed. You can install it from here: [Node.js](https://nodejs.org/en/). Then, navigate to your repository folder and type in **_npm init_** in the terminal to initialize. Then, you will need to install these npm packages: [express](https://www.npmjs.com/package/express), [socket.io](https://www.npmjs.com/package/socket.io), [body-parser](https://www.npmjs.com/package/body-parser), [oauth](https://www.npmjs.com/package/oauth). You can follow the instruction from those pages, or simply type **_npm install express socket.io body-parser oauth_** in the terminal.

After you've done all the installations, it is time to get the API key from Noun Project. Please follow the instruction here [Noun Project Documentation](http://api.thenounproject.com/getting_started.html#creating-an-api-key) to get your key and secure. Once you have that, create a file called **_config.js_** in your folder and type in the following:
>module.exports = {
	key:'_your key here_',
	secret: '_your secret here_'
}

Now, you should be able to run the program by typing **_node server.js_** in your terminal. Then, go to **_localhost:3000_** and start playing it!

## Future development
- Right now, the flag is not drawn properly as I expected, so I will try to fix that so that players have their special icons to differentiate from others.
	
- Also, right now, it requires users to enter the game page at the same time to make the game work properly, which can be annoying if it is to be developed on web. I will also try to fix that.
