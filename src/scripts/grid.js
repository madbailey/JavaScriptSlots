import Symbol from './symbol_list.js'; // Importing the Symbol class

class Grid {
    constructor(rows, columns, player) {
        this.rows = rows; //should be 4
        this.columns = columns; //should be 5
        this.player = player;
        this.grid = Array.from({ length: rows }, () => Array(columns).fill(null));
        console.log("Grid initialization check:", this.grid);
        this.placeSymbols();
        this.updateReels();
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

    calculateScores() {
        this.applyGlobalEffects();
        this.checkInteractions();
        this.calculatePayouts();
    }
   
    removeSymbol(symbol) {
        console.log("removing!")
        this.player.removeSymbol(symbol.alias);
    }
    
    countSymbols(alias) {
        let count = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.grid[row][col] && this.grid[row][col].alias === alias) {
                    count++;
                }
            }
        }
        return count;
    }

    countSymbolsInRow(alias, row) {
        // Check if row index is defined and within valid range
        if (typeof row === "undefined" || row < 0 || row >= this.rows) {
            console.error("Invalid row index:", row);
            return 0;  // Return 0 as the count for safety
        }
    
        let count = 0;
        // Ensure that the row exists in the grid to avoid undefined errors
        if (this.grid[row]) {
            this.grid[row].forEach(symbol => {
                if (symbol && symbol.alias === alias) {
                    count++;
                }
            });
        } else {
            console.error("No such row exists in the grid:", row);
        }
        return count;
    }

    applyGlobalEffects() {
        this.grid.forEach((row, rowIndex) => {
            row.forEach(symbol => {
                // Ensure you are correctly passing rowIndex where required
                if (symbol && symbol.globalEffect) {
                    if (symbol.globalEffect.effectType === 'rowMultiplier') {
                        symbol.applyGlobalEffects(this, rowIndex); // Make sure rowIndex is passed
                    } else {
                        symbol.applyGlobalEffects(this);
                    }
                }
            });
        });
    }
    clearGrid() {
        this.grid = Array.from({ length: this.rows }, () => Array(this.columns).fill(null));
    }

    checkInteractions() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.grid[row][col] !== null) {  // Check if the symbol still exists
                    this.checkAdjacentSymbols(row, col);
                }
            }
        }
    }

    checkAdjacentSymbols(row, col) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
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

    calculatePayouts() {
        let totalPayout = 0;
        this.grid.forEach(row => row.forEach(symbol => {
            if (symbol) {
                totalPayout += symbol.basePayout;
            }
        }));
        this.player.addMoney(totalPayout);
        console.log(`Total payout this round: ${totalPayout}`);
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