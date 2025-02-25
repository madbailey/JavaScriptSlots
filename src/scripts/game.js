// src/scripts/game.js
import Grid from './grid.js';
import Player from './player.js';
import symbols from './symbol_list.js';  // Import the symbols

const GameState = {
    WAITING: 'waiting',
    SPINNING: 'spinning',
    SCORING: 'scoring',
    RESULT: 'result',
    ADD_SYMBOL: 'add_symbol',
    GAME_OVER: 'game_over' // Add a game over state
};

class Game {
    constructor(player) {
        this.grid = new Grid(4, 5, player);
        this.player = player;
        this.state = GameState.WAITING;
        this.rentDue = 50;  // Initial rent
        this.rentIncrease = 40; // Increased from 25 to 40 - rent grows faster
        this.spinsRemaining = 8; // Reduced from 15 to 8 - fewer spins before rent is due
        this.currentSpin = 0;
        this.difficulty = 1.0; // Difficulty multiplier that increases over time
    }

    start() {
        console.log('Game started');
        this.setState(GameState.WAITING);
        this.grid.initializeReels();
        this.updateUI(); // Add a method to update the entire UI
    }

    spin() {
        if (this.state !== GameState.WAITING) return;
    
        console.log('Spinning...');
        this.setState(GameState.SPINNING);
        this.grid.clearGrid();
        this.currentSpin++;
        this.grid.placeSymbols(); //place symbols before the timeout
    
        // Trigger the spinReels animation
        this.grid.spinReels().then(() => { // Await completion of animation
            this.grid.calculateScores();
            this.grid.render(); // Update the grid display
            this.grid.updateReels(); //update the UI
            this.setState(GameState.SCORING);
            
            // Allow more time for animations to complete before showing results
            setTimeout(() => {
                this.showResult();
            }, 2500); // Increased time to allow animations to fully complete
        });
    }


    showResult() {
        console.log('Showing result...');
        this.setState(GameState.RESULT);
        this.updateUI(); // Update money display

        // Decrement the spins remaining
        this.spinsRemaining--;
        this.updateUI(); // Update UI with new spins count

        if (this.spinsRemaining <= 0) {
            this.checkRentPayment();
        } else {
            // Go to add symbol phase with a longer delay for animations
            setTimeout(() => {
                this.promptNewSymbol();
            }, 2000); // Increased from 1000ms to allow animations to complete
        }
    }

    promptNewSymbol() {
        console.log('Adding new symbol...');
        this.setState(GameState.ADD_SYMBOL);

        // Delay displaying symbol choices to ensure all animations have completed
        setTimeout(() => {
            // Display symbol choices to the player.  This is *crucial*.
            this.displaySymbolChoices();
        }, 1000);

        // Player.addSymbol() will now be called *after* the player makes a choice.
    }

    waitForNextRound() {
        console.log('Waiting for next round...');
        this.setState(GameState.WAITING);
        this.updateUI();
    }


    setState(newState) {
        console.log(`Transitioning to ${newState}`);
        this.state = newState;
    }

    updateUI() {
        this.player.updateMoneyDisplay();
        
        // Update rent display with visual warnings when running low on money
        const rentDisplay = document.getElementById('rentDisplay');
        rentDisplay.textContent = `Rent Due: ${this.rentDue}`;
        
        // Reset classes
        rentDisplay.classList.remove('rent-warning', 'rent-danger');
        
        // Add warning classes based on wallet vs rent
        if (this.player.wallet < this.rentDue) {
            // Danger: Not enough money to pay rent
            rentDisplay.classList.add('rent-danger');
        } else if (this.player.wallet < this.rentDue * 1.5) {
            // Warning: Close to not having enough
            rentDisplay.classList.add('rent-warning');
        }
        
        document.getElementById('spinsRemainingDisplay').textContent = `Spins Remaining: ${this.spinsRemaining}`;
    }

    checkRentPayment() {
        if (this.player.wallet >= this.rentDue) {
            this.player.removeMoney(this.rentDue);
            
            // Increase the difficulty slightly each time rent is paid
            this.difficulty += 0.15;
            
            // Increase rent by a larger amount as game progresses
            this.rentDue += Math.floor(this.rentIncrease * this.difficulty);
            
            // Decrease the number of spins before rent as game progresses
            // But never less than 5 spins
            this.spinsRemaining = Math.max(5, Math.floor(8 - this.difficulty + 1));
            
            this.updateUI();
            this.promptNewSymbol(); // Continue the game
              // Add "rent paid" animation
              const rentDisplay = document.getElementById('rentDisplay');
              rentDisplay.classList.add('rent-paid');
              setTimeout(() => {
                  rentDisplay.classList.remove('rent-paid');
              }, 2000);
        } else {
            this.setState(GameState.GAME_OVER);
            alert("Game Over! You couldn't pay the rent.");
            // You could also offer a "restart" button here.
             // Disable spin button
             document.getElementById('spinButton').disabled = true;
        }
    }

    displaySymbolChoices() {
        const symbolChoicesContainer = document.getElementById('symbolChoices');
        const popupBackground = document.createElement('div');
        popupBackground.classList.add('popup-background');
        document.body.appendChild(popupBackground);
        popupBackground.style.display = 'block';
    
        symbolChoicesContainer.innerHTML = ''; // Clear previous choices
    
        // Create a title
        const title = document.createElement('h2');
        title.textContent = "Choose a Symbol";
        symbolChoicesContainer.appendChild(title);
    
        // Create a grid layout container
        const choiceContainer = document.createElement('div');
        choiceContainer.classList.add('symbol-choice-container');
        symbolChoicesContainer.appendChild(choiceContainer);
    
        // Get 3 random symbols - weighted by game difficulty
        // As game progresses, chance of getting high-value symbols decreases
        const availableSymbols = Object.keys(symbols);
        const chosenSymbols = [];
        
        for (let i = 0; i < 3; i++) {
            // Apply difficulty-based weighting
            let selectedSymbol;
            
            // 30% chance to give a low-value symbol as game progresses
            if (this.difficulty > 1.5 && Math.random() < 0.3 * (this.difficulty - 1)) {
                // Filter to get low-value symbols (payout <= 2)
                const lowValueSymbols = availableSymbols.filter(symbol => 
                    symbols[symbol].basePayout <= 2 && !chosenSymbols.includes(symbol)
                );
                
                if (lowValueSymbols.length > 0) {
                    const randomIndex = Math.floor(Math.random() * lowValueSymbols.length);
                    selectedSymbol = lowValueSymbols[randomIndex];
                }
            }
            
            // If we didn't select a low-value symbol, pick randomly from remaining symbols
            if (!selectedSymbol) {
                // Remove already chosen symbols from available options
                const remainingSymbols = availableSymbols.filter(s => !chosenSymbols.includes(s));
                const randomIndex = Math.floor(Math.random() * remainingSymbols.length);
                selectedSymbol = remainingSymbols[randomIndex];
            }
            
            chosenSymbols.push(selectedSymbol);
        }
    
        chosenSymbols.forEach(symbolAlias => {
            const symbol = symbols[symbolAlias];
            const button = document.createElement('div');
    
            // Apply styles
            button.classList.add('symbol-choice');
            button.innerHTML = `
                <div class="symbol-icon">${symbol.unicode}</div>
                <div class="symbol-name"><b>${symbol.alias}</b></div>
                <div class="symbol-description">${symbol.tooltip}</div>
            `;
    
            button.onclick = () => {
                this.player.addSymbol(symbolAlias);
                symbolChoicesContainer.innerHTML = ''; // Clear choices after selection
                symbolChoicesContainer.style.display = 'none';
                popupBackground.style.display = 'none'; // Hide background blur
                document.body.removeChild(popupBackground);
                this.waitForNextRound();
            };
    
            choiceContainer.appendChild(button);
        });
    
        // Show the container
        symbolChoicesContainer.style.display = 'flex';
    }
    
    
}

export default Game;