import Symbol from './symbol_list.js'; // Importing the Symbol class

class Grid {
    constructor(rows, columns, player) {
        this.rows = rows; //should be 4
        this.columns = columns; //should be 5
        this.player = player;
        this.grid = Array.from({ length: rows }, () => Array(columns).fill(null));
        this.placeSymbols(); // Place symbols on grid initialization
        this.updateReels(); // Update reels after placing symbols
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
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                this.checkAdjacentSymbols(row, col);
            }
        }
    }
    payOut() {
        console.log("payout")

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

    // Update the DOM elements for each reel with symbols
    updateReels() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                // Create a correct ID by formatting the row and column indices
                const reelId = `reel${row}${col}`;
                const reelElement = document.getElementById(reelId);
                if (reelElement) {
                    if (this.grid[row][col]) {
                        reelElement.innerHTML = this.grid[row][col].render(); // Ensure Symbol class has a render method
                    } else {
                        reelElement.innerHTML = ' '; // Clear if no symbol
                    }
                } else {
                    console.error(`Element with ID ${reelId} not found`);
                }
            }
        }
    }
}

export default Grid;