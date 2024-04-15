// game.js

const GameState = {
    WAITING: 'waiting',
    SPINNING: 'spinning',
    SCORING: 'scoring',
    RESULT: 'result',
    ADD_SYMBOL: 'add_symbol'
};

class Game {
    constructor() {
        this.state = GameState.WAITING;
    }

    start() {
        console.log('Game started');
        this.setState(GameState.WAITING);
    }

    spin() {
        if (this.state !== GameState.WAITING) return;
        console.log('Spinning...');
        this.setState(GameState.SPINNING);

        // Simulate spinning duration
        setTimeout(() => {
            this.scoreRound();
        }, 2000); // 2 seconds of spinning
    }

    scoreRound() {
        console.log('Scoring round...');
        this.setState(GameState.SCORING);

        // Score calculation logic here
        // Transition to RESULT state
        this.showResult();
    }

    showResult() {
        console.log('Showing result...');
        this.setState(GameState.RESULT);

        // Handle result display and transitions
        setTimeout(() => {
            this.promptNewSymbol();
        }, 1000); // Show result for 1 second
    }

    promptNewSymbol() {
        console.log('Adding new symbol...');
        this.setState(GameState.ADD_SYMBOL);

        // Logic to add a new symbol
        // Transition back to WAITING
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