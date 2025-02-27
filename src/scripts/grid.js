// src/scripts/grid.js

import symbols from './symbol_list.js';

class Grid {
    constructor(rows, columns, player) {
        this.rows = rows;
        this.columns = columns;
        this.player = player;
        this.grid = Array.from({ length: rows }, () => Array(columns).fill(null));
    }

    placeSymbols() {
        this.clearGrid(); // Clear before placing
        let inventory = this.player.getInventorySymbols();
        let totalSlots = this.rows * this.columns;
        let symbolIndexes = [];

        // Create a shuffled array of all possible positions
        let positions = Array.from({length: totalSlots}, (_, i) => i);
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]]; // Fisher-Yates shuffle
        }


         // Place symbols, handling cases where inventory is smaller than the grid
        for (let i = 0; i < Math.min(positions.length, inventory.length); i++) {
            let row = Math.floor(positions[i] / this.columns);
            let col = positions[i] % this.columns;
            this.grid[row][col] = inventory[i];
         }
    }


   calculateScores() {
        // Reset payouts before recalculating
        this.grid.forEach(row => row.forEach(symbol => {
            if (symbol) symbol.basePayout = symbols[symbol.alias].basePayout; // IMPORTANT: Reset to base
        }));

        this.applyGlobalEffects();
        this.checkInteractions();
        this.calculatePayouts(); // This should happen *after* all effects
    }

  removeSymbol(symbol) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.grid[row][col] === symbol) {
                    this.grid[row][col] = null;  // Remove from the grid
                    this.player.removeSymbol(symbol.alias); // Remove from player inventory
                    return; // Exit after finding and removing
                }
            }
        }
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
        if (typeof row === "undefined" || row < 0 || row >= this.rows) {
            console.error("Invalid row index:", row);
            return 0;
        }

        let count = 0;
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
        this.grid.forEach((row, rowIndex) => { // Get rowIndex here
            row.forEach(symbol => {
                if (symbol) {
                    symbol.applyGlobalEffects(this, rowIndex); // Pass rowIndex
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
                const currentSymbol = this.grid[row][col];
                if (currentSymbol) {
                    this.checkAdjacentSymbols(row, col, currentSymbol);  //Pass current symbol
                }
            }
        }
    }

   checkAdjacentSymbols(row, col, currentSymbol) { //Added current symbol
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        directions.forEach(([dRow, dCol]) => {
            let adjRow = row + dRow;
            let adjCol = col + dCol;

            if (adjRow >= 0 && adjRow < this.rows && adjCol >= 0 && adjCol < this.columns) {
                let adjSymbol = this.grid[adjRow][adjCol];
                if (adjSymbol) {
                    // Use the currentSymbol for the interaction.
                    currentSymbol.executeInteraction(adjSymbol, this);
                }
            }
        });
    }
    async spinReels() {
        const nextSymbols = Array(this.rows).fill(null).map(() => Array(this.columns).fill(null));
    
        // Precompute next symbols
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const symbol = this.grid[row][col];
                nextSymbols[row][col] = symbol ? symbol.unicode : '?';
            }
        }
    
        // Make all reels spin initially
        for (let col = 0; col < this.columns; col++) {
            for (let row = 0; row < this.rows; row++) {
                const reelElement = document.getElementById(`reel${row}${col}`);
                const reelContent = reelElement.querySelector('.reel-content');
                reelContent.style.transform = 'translateY(-300%)'; 
                reelContent.classList.add('spinning');
            }
        }
    
        // Sequentially stop each column with a delay
        for (let col = 0; col < this.columns; col++) {
            await this.delay(200 + Math.random() * 150); // Randomize column spin stop timing slightly

            for (let row = 0; row < this.rows; row++) {
                const reelElement = document.getElementById(`reel${row}${col}`);
                const reelContent = reelElement.querySelector('.reel-content');
    
                setTimeout(() => {
                    reelContent.classList.remove('spinning');
                    reelContent.style.transition = "transform 0.8s ease-out";
                    reelContent.style.transform = "translateY(0)";
    
                    // Update the inner symbol
                    const symbolElement = reelContent.querySelector('.symbol');
                    symbolElement.textContent = nextSymbols[row][col];
    
                    // Add slight shake effect when stopping
                    reelElement.classList.add('shake');
                    setTimeout(() => reelElement.classList.remove('shake'), 50);
                }, 200);
            }
        }
    }
    

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Update the placeSymbols method
    async placeSymbols() {
        this.clearGrid();
        let inventory = this.player.getInventorySymbols();
        let totalSlots = this.rows * this.columns;
        let positions = Array.from({length: totalSlots}, (_, i) => i);
        
        // Shuffle positions
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        // Place symbols in grid (but don't update display yet)
        for (let i = 0; i < Math.min(positions.length, inventory.length); i++) {
            let row = Math.floor(positions[i] / this.columns);
            let col = positions[i] % this.columns;
            this.grid[row][col] = inventory[i];
        }

        // Animate the reels
        await this.spinReels();
    }


    calculatePayouts() {
        let totalPayout = 0;
        this.payoutsThisRound = []; // ADD THIS: Store individual payouts

        this.grid.forEach((row, rowIndex) => {
            row.forEach((symbol, colIndex) => {
                if (symbol) {
                    const payout = symbol.basePayout;
                    totalPayout += payout;

                    // RECORD THE PAYOUT:
                    this.payoutsThisRound.push({
                        row: rowIndex,
                        col: colIndex,
                        amount: payout,
                        symbol: symbol // Optionally store the symbol itself
                    });
                    console.log(`Symbol ${symbol.alias} payout: ${symbol.basePayout}`); // Debugging
                }
            });
        });

        this.player.addMoney(totalPayout);
        console.log(`Total payout this round: ${totalPayout}`);
    }

    // Render the grid for display (console-based, for debugging)
    render() {
        return this.grid.map(row => row.map(symbol => symbol ? symbol.render() : ' ').join(' ')).join('\n');
    }

    initializeReels() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const reelId = `reel${row}${col}`;
                const reelElement = document.getElementById(reelId);
                if (reelElement) {
                     const symbolElement = reelElement.querySelector('.symbol');
                    const payoutElement = reelElement.querySelector('.payout');

                    if (this.grid[row][col]) {
                      symbolElement.textContent = this.grid[row][col].unicode;
                    }
                    else {
                      symbolElement.textContent = '?';
                    }
                    payoutElement.style.display = 'none';
                }
            }
        }
    }

    // Clear animation classes from all reels
    clearAnimationClasses() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const reelElement = document.getElementById(`reel${row}${col}`);
                if (reelElement) {
                    const symbolElement = reelElement.querySelector('.symbol');
                    if (symbolElement) {
                        symbolElement.classList.remove('cat-drinking', 'milk-destroyed', 'milk-being-consumed', 'symbol-win');
                    }
                    
                    // Remove any bonus payout elements
                    const bonusElements = reelElement.querySelectorAll('.bonus-payout');
                    bonusElements.forEach(el => el.remove());
                    
                    // Remove any connection effects
                    const connectionElements = reelElement.querySelectorAll('.connection-effect');
                    connectionElements.forEach(el => el.remove());
                }
            }
        }
    }

    updateReels() {
        // First clear animation classes from previous rounds
        this.clearAnimationClasses();
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const reelId = `reel${row}${col}`;
                const reelElement = document.getElementById(reelId);
    
                if (reelElement) {
                    const symbolElement = reelElement.querySelector('.symbol');
                    const payoutElement = reelElement.querySelector('.payout'); // Keep for compatibility
    
                    if (this.grid[row][col]) {
                        const symbol = this.grid[row][col];
                        symbolElement.textContent = symbol.unicode;
    
                        // Process interactions with a delay to ensure they happen after spinning completes
                        setTimeout(() => {
                            // --- Animation Logic ---
                            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                            directions.forEach(([dRow, dCol]) => {
                                const adjRow = row + dRow;
                                const adjCol = col + dCol;
    
                                // Prevent out-of-bounds errors
                                if (adjRow >= 0 && adjRow < this.rows && adjCol >= 0 && adjCol < this.columns) {
                                    const adjSymbol = this.grid[adjRow][adjCol];
    
                                    if (adjSymbol) {
                                        if (symbol.alias === 'cat' && adjSymbol.alias === 'milk') {
                                            console.log("Cat drinks Milk!");
    
                                            // Apply cat "drinking" effect
                                            symbolElement.classList.add('cat-drinking');
    
                                            // Fade out the milk symbol
                                            const adjReel = document.getElementById(`reel${adjRow}${adjCol}`);
                                            if (adjReel) {
                                                const adjSymbolElement = adjReel.querySelector('.symbol');
                                                
                                                // First show milk being consumed animation
                                                adjSymbolElement.classList.add('milk-being-consumed');
                                                
                                                // Create a connection effect between cat and milk
                                                const connectionEffect = document.createElement('div');
                                                connectionEffect.className = 'connection-effect';
                                                reelElement.appendChild(connectionEffect);
                                                
                                                // After a delay, show milk disappearing
                                                setTimeout(() => {
                                                    adjSymbolElement.classList.remove('milk-being-consumed');
                                                    adjSymbolElement.classList.add('milk-destroyed');
                                                    
                                                    // Show floating bonus payout text
                                                    const bonusDiv = document.createElement('div');
                                                    bonusDiv.className = 'bonus-payout';
                                                    bonusDiv.textContent = `+${adjSymbol.basePayout} Bonus!`;
                                                    reelElement.appendChild(bonusDiv);
                                                    
                                                    // Clean up after animation 
                                                    setTimeout(() => {
                                                        adjSymbolElement.textContent = "?";
                                                        adjSymbolElement.classList.remove('milk-destroyed');
                                                        symbolElement.classList.remove('cat-drinking');
                                                        connectionEffect.remove();
                                                        bonusDiv.remove();
                                                    }, 1000);
                                                }, 700);
                                            }
                                        }
    
                                        // --- Pirate + Dog Bonus Animation ---
                                        else if (symbol.alias === 'pirate' && adjSymbol.alias === 'dog') {
                                            const adjReel = document.getElementById(`reel${adjRow}${adjCol}`);
                                            if (adjReel) {
                                                const adjSymbolElement = adjReel.querySelector('.symbol');
                                                
                                                // Create a friendship effect
                                                symbolElement.classList.add('pirate-dog-friend');
                                                adjSymbolElement.classList.add('pirate-dog-friend');
                                                
                                                // Create a bonus indicator
                                                const bonusDiv = document.createElement('div');
                                                bonusDiv.className = 'bonus-payout';
                                                bonusDiv.textContent = 'Friends!';
                                                reelElement.appendChild(bonusDiv);
                                                
                                                // Clean up after animation
                                                setTimeout(() => {
                                                    symbolElement.classList.remove('pirate-dog-friend');
                                                    adjSymbolElement.classList.remove('pirate-dog-friend');
                                                    bonusDiv.remove();
                                                }, 2000);
                                            }
                                        }
                                    }
                                }
                            });
                        }, 500); // Small delay to ensure reels have stopped spinning
    
                        // --- End Animation Logic ---
                        payoutElement.style.display = 'none'; // Hide original payout
                    } else {
                        symbolElement.textContent = '?';
                        payoutElement.style.display = 'none'; // Hide if no symbol
                    }
                }
            }
        }
    
        // Delay payout animations to come after symbol interactions
        setTimeout(() => {
            this.animatePayouts();
        }, 1000);
    }
    
    animatePayouts() {
        const walletElement = document.getElementById('moneyDisplay');
        const walletRect = walletElement.getBoundingClientRect();
        let totalPayout = 0;
    
        // Stagger the animations slightly
        this.payoutsThisRound.forEach((payoutInfo, index) => {
            totalPayout += payoutInfo.amount;
            const reelElement = document.getElementById(`reel${payoutInfo.row}${payoutInfo.col}`);
            if (!reelElement) return;
    
            const startRect = reelElement.getBoundingClientRect();
            const symbolElement = reelElement.querySelector('.symbol');
            
            // Add sparkle to winning symbol
            symbolElement.classList.add('symbol-win');
            setTimeout(() => symbolElement.classList.remove('symbol-win'), 2000);
    
            // Create floating payout
            const payoutDiv = document.createElement('div');
            payoutDiv.className = 'floating-payout';
            payoutDiv.textContent = `+${payoutInfo.amount}`;
            
            // Special styling for big wins
            if (payoutInfo.amount >= 10) {
                payoutDiv.classList.add('mega-win');
            }
    
            document.body.appendChild(payoutDiv);
    
            // Initial position
            payoutDiv.style.left = `${startRect.left + startRect.width / 2}px`;
            payoutDiv.style.top = `${startRect.top + startRect.height / 2}px`;
    
            // Stagger the animations
            setTimeout(() => {
                payoutDiv.style.transform = `translate(
                    ${walletRect.left - startRect.left}px, 
                    ${walletRect.top - startRect.top}px
                ) scale(0.2)`;
                payoutDiv.style.opacity = '0';
            }, index * 250);
    
            // Cleanup
            setTimeout(() => {
                payoutDiv.remove();
            }, 1500 + (index * 100));
        });
    
        // Show total win animation if significant
        if (totalPayout >= 500) {
            const bigWinDiv = document.createElement('div');
            bigWinDiv.className = 'floating-payout mega-win';
            bigWinDiv.textContent = `Big Win! +${totalPayout}`;
            bigWinDiv.style.left = '50%';
            bigWinDiv.style.top = '50%';
            bigWinDiv.style.transform = 'translate(-50%, -50%) scale(2)';
            document.body.appendChild(bigWinDiv);
    
            setTimeout(() => {
                bigWinDiv.style.transform = 'translate(-50%, -150%) scale(0)';
                bigWinDiv.style.opacity = '0';
            }, 1000);
    
            setTimeout(() => bigWinDiv.remove(), 2000);
        }
    }
}

export default Grid;