import Symbol from './symbol_list.js'; // Importing the Symbol class

class Grid {
    constructor(rows, columns, player) {
        this.rows = rows; //should be 4
        this.columns = columns; //should be 5
        this.player = player;
        this.grid = Array.from({ length: rows }, () => Array(columns).fill(null));
        this.gameState= 'waiting';
        this.placeSymbols(); // Place symbols on grid initialization
        this.updateReels(); // Update reels after placing symbols
       }

    setGameState(state) {
        this.gameState = state;
    }

    // Randomly place symbols from the player's inventory across the grid
    placeSymbols() {
        let inventory = this.player.getInventorySymbols();
        console.log("Inventory symbols:", inventory); // Check mapped symbols
        let totalSlots = this.rows * this.columns;
        let symbolIndexes = [];
    
        inventory.forEach(symbol => {
            let position = Math.floor(Math.random() * totalSlots);
            while (symbolIndexes.includes(position)) {
                position = Math.floor(Math.random() * totalSlots);
            }
            symbolIndexes.push(position);
        });
    
        console.log("Symbol indexes:", symbolIndexes); // Debugging positions
    
        symbolIndexes.forEach(index => {
            let row = Math.floor(index / this.columns);
            let col = index % this.columns;
            if (inventory.length > 0) {
                let symbol = inventory.shift();
                console.log(`Placing symbol at [${row}, ${col}]: ${symbol.render()}`); // Log placed symbol
                this.grid[row][col] = symbol;
            }
        });
    }
   
    removeSymbol(symbol) {
        console.log("removing!")
    }

    clearGrid() {
        this.grid = Array.from({ length: this.rows }, () => Array(this.columns).fill(null));
    }

    // Check for and handle interactions after a spin
    checkInteractions() {
        let totalPayout = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const symbol = this.grid[row][col];
                if (symbol) {
                    totalPayout += symbol.basePayout;  // Add the base payout of each symbol to total
                    // If there were interactions, you could still handle them here
                }
            }
        }
        this.player.addMoney(totalPayout);  // Update the player's wallet with the total payout
        console.log(`Total payout: ${totalPayout}`);
    }

    // Check adjacent symbols for the current symbol and trigger interactions
    checkAdjacentSymbols(row, col) {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
        ];

        const currentSymbol = this.grid[row][col];
        if (!currentSymbol) return;

        directions.forEach(([dRow, dCol]) => {
            let adjRow = row + dRow, adjCol = col + dCol;
            if (adjRow >= 0 && adjRow < this.rows && adjCol >= 0 && adjCol < this.columns) {
                let adjSymbol = this.grid[adjRow][adjCol];
                if (adjSymbol) {
                    currentSymbol.executeInteraction(adjSymbol, this);
                }
            }
        });
    }

    // Render the grid for display
    render() {
        return this.grid.map(row => row.map(symbol => symbol ? symbol.render() : ' ').join(' ')).join('\n');
    }

    initializeReels() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const reelId = `reel${row}${col}`;
                const reelElement = document.getElementById(reelId);
                const symbolElement = reelElement.querySelector('.symbol');
                const payoutElement = reelElement.querySelector('.payout');
    
                if (reelElement) {
                    symbolElement.textContent = this.grid[row][col] ? this.grid[row][col].unicode : '?';
                    payoutElement.style.display = 'none';  // Ensure payouts are not visible on initialization
                }
            }
        }
    }

    // Update the DOM elements for each reel with symbols
    updateReels() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const reelId = `reel${row}${col}`;
                const reelElement = document.getElementById(reelId);
                const symbolElement = reelElement.querySelector('.symbol');
                const payoutElement = reelElement.querySelector('.payout');
    
                if (reelElement && this.grid[row][col]) {
                    symbolElement.textContent = this.grid[row][col].unicode;  // Update the symbol
                    payoutElement.textContent = `+${this.grid[row][col].basePayout}`;  // Update the payout
                    payoutElement.style.display = 'block';  // Make the payout visible
    
                    // Optionally trigger animation here
                    payoutElement.classList.add('fly-to-wallet');
                    setTimeout(() => {
                        payoutElement.classList.remove('fly-to-wallet');
                        payoutElement.style.display = 'none';  // Hide after animation
                    }, 2000);  // Animation duration
                } else {
                    symbolElement.textContent = '?';  // Reset or keep as placeholder
                    payoutElement.style.display = 'none';
                }
            }
        }
    }
    
}

export default Grid;