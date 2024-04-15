import Game from './game.js';
import Player from './player.js';

const player = new Player();
const game = new Game(player);

window.startSpin = function() {
    game.spin();
}

document.addEventListener('DOMContentLoaded', function() {
    game.start();
});
