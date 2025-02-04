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
        this.grid = new Grid(4, 5, player);
        this.player = player;
        this.state = GameState.WAITING;
        this.symbolChoices = ['cat', 'milk', 'dog', 'pirate'];
        this.setupEventListeners();
    }

    setupEventListeners() {
        const resultDisplay = document.getElementById('resultDisplay');
        document.getElementById('spinButton').addEventListener('click', () => {
            if (this.state === GameState.WAITING) {
                if (this.player.wallet >= 5) { // Cost to spin
                    this.player.removeMoney(5);
                    this.spin();
                } else {
                    resultDisplay.textContent = "Not enough money to spin!";
                }
            }
        });
    }

    spin() {
        if (this.state !== GameState.WAITING) return;

        const resultDisplay = document.getElementById('resultDisplay');
        resultDisplay.textContent = "Spinning...";
        
        this.setState(GameState.SPINNING);
        this.grid.clearGrid();

        // Disable spin button during animation
        document.getElementById('spinButton').disabled = true;

        // Animate the reels
        this.animateReels().then(() => {
            this.grid.placeSymbols();
            this.grid.calculateScores();
            this.grid.render();
            this.grid.updateReels();
            this.showResult();
        });
    }

    async animateReels() {
        const reels = document.querySelectorAll('.reel');
        const symbols = ['🐱', '🥛', '🐶', '🏴‍☠️'];
        
        // Create animation promises for each reel
        const animations = Array.from(reels).map((reel, index) => {
            return new Promise(resolve => {
                let count = 0;
                const symbolElement = reel.querySelector('.symbol');
                
                const interval = setInterval(() => {
                    symbolElement.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    count++;
                    
                    if (count > 10 + (index * 2)) { // Stagger the stopping of reels
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        });

        await Promise.all(animations);
    }

    showResult() {
        const resultDisplay = document.getElementById('resultDisplay');
        resultDisplay.textContent = "Calculating winnings...";
        
        setTimeout(() => {
            this.setState(GameState.RESULT);
            resultDisplay.textContent = "Choose a new symbol!";
            this.promptNewSymbol();
        }, 2000);
    }

    promptNewSymbol() {
        const resultDisplay = document.getElementById('resultDisplay');
        resultDisplay.innerHTML = `
            Choose a new symbol:<br>
            ${this.symbolChoices.map((symbol, index) => `
                <button class="symbol-choice" data-symbol="${symbol}">
                    ${symbols[symbol].unicode}
                </button>
            `).join('')}
        `;

        // Add event listeners to symbol choice buttons
        document.querySelectorAll('.symbol-choice').forEach(button => {
            button.addEventListener('click', () => {
                const symbol = button.dataset.symbol;
                this.player.addSymbol(symbol);
                this.waitForNextRound();
                resultDisplay.textContent = "Ready for next spin!";
                document.getElementById('spinButton').disabled = false;
            }, { once: true }); // Ensure event listener only fires once
        });
    }

    waitForNextRound() {
        this.setState(GameState.WAITING);
        this.grid.initializeReels();
    }

    setState(newState) {
        this.state = newState;
    }
}

export default Game;