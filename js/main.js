//const mongoose = require('mongoose');
var game = new Phaser.Game(800,600, Phaser.Auto, 'gameArea');

game.state.add('open', openState);
game.state.add('mainMenu', mainMenu);
//game.state.add('test', testing);
game.state.add('gameOver', gameOver);

game.state.start('mainMenu');