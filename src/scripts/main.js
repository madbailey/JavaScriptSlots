// src/scripts/main.js
import Game from './game.js';
import Player from './player.js';

const player = new Player();
const game = new Game(player);
player.setGame(game); //pass game to player

window.startSpin = function() {
    game.spin();
}

document.addEventListener('DOMContentLoaded', function() {
    game.start();
});