// main.js

import Game from './game.js';
import Player from './player.js';
import Grid from './grid.js';
import GameSymbol from './gameSymbol.js';

const game = new Game();
const player = new Player();
console.log(player.inventory);
player.updateMoneyDisplay();


const grid = new Grid(player);


const spinButton = document.getElementById('spinButton');
spinButton.addEventListener('click', () => {
  game.spin();
});


game.start();