import Grid from './grid.js';  // Import the Grid class
import Player from './player.js';  // Assuming Player is also a needed class

const GameState = {
    WAITING: 'waiting',
    SPINNING: 'spinning',
    SCORING: 'scoring',
    RESULT: 'result',
    ADD_SYMBOL: 'add_symbol'
};

class Game {
    constructor(player) {
        this.grid = new Grid(4, 5, player);  // Assume dimensions and player are predefined
        this.player = player;
        this.state = GameState.WAITING;
    }

    start() {
        console.log('Game started');
        this.setState(GameState.WAITING);
        this.grid.initializeReels();  // Initial reels update if necessary
    }

    spin() {
        if (this.state !== GameState.WAITING) return;

        console.log('Spinning...');
        this.setState(GameState.SPINNING);
        this.grid.clearGrid();  // Clear the grid before spinning

        this.grid.placeSymbols();
        this.grid.calculateScores();
        this.grid.render();
        this.grid.updateReels();

        // Simulate spinning duration
        setTimeout(() => {
            this.showResult();
        }, 2000);  // 2 seconds of spinning
    }


    showResult() {
        console.log('Showing result...');
        this.setState(GameState.RESULT);
        this.grid.initializeReels();  // Reset the reels


        setTimeout(() => {
            this.promptNewSymbol();
        }, 1000);  // Show result for 1 second
    }

    promptNewSymbol() {
        console.log('Adding new symbol...');
        this.setState(GameState.ADD_SYMBOL);

        // Add new symbol logic
        this.player.addSymbol();  // Assume Player handles adding symbols

        this.waitForNextRound();
    }

    waitForNextRound() {
        console.log('Waiting for next round...');
        this.setState(GameState.WAITING);
    }

    setState(newState) {
        console.log(`Transitioning to ${newState}`);
        this.state = newState;
    }
}

export default Game;  // Export the Game class for use in other modules
