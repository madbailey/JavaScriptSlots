import Symbol from './gameSymbol.js'; // Importing the Symbol class

class Grid {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.grid = Array.from({ length: rows }, () => Array(columns).fill(null));
    }

    // Fill the grid with symbols based on a dictionary mapping from player choices
    placeSymbols(playerSymbols) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                // Assuming playerSymbols is a 2D array of symbol aliases
                let alias = playerSymbols[row][col];
                if (alias) {
                    // Create new Symbol instance based on alias, etc.
                    // This assumes you have a way to lookup symbol details by alias
                    let symbolDetails = this.lookupSymbolDetails(alias);
                    let symbol = new Symbol(symbolDetails.unicode, symbolDetails.alias, symbolDetails.tooltip, symbolDetails.basePayout);
                    this.grid[row][col] = symbol;
                }
            }
        }
    }

    // Method to lookup symbol details based on alias
    lookupSymbolDetails(alias) {
        // Stub for lookup - should be replaced with actual logic to retrieve symbol information
        return { unicode: '🔮', alias: alias, tooltip: 'Mystical power', basePayout: 10 };
    }

    // Check for and handle interactions after a spin
    checkInteractions() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                this.checkAdjacentSymbols(row, col);
            }
        }
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
}

export default Grid;
