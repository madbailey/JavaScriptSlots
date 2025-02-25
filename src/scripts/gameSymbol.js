class GameSymbol {
    constructor(unicode, alias, tooltip, basePayout, rarity) {
        this.unicode = unicode;
        this.alias = alias;
        this.tooltip = tooltip;
        this.basePayout = basePayout;
        this.rarity = rarity;
        this.globalEffects = [];
        this.adjacencyEffects = {};
        this.age = 0; // For aging symbols like eggs
        this.bankBalance = 0; // For bank symbol
        this.storedValue = 0; // For symbols that accumulate value
    }

    addGlobalEffect(effectType, params) {
        this.globalEffects.push({ effectType, params });
    }

    addAdjacencyEffect(adjSymbolAlias, effectType, params) {
        this.adjacencyEffects[adjSymbolAlias] = { effectType, params };
    }

    executeInteraction(adjSymbol, grid) {
        let effect = this.adjacencyEffects[adjSymbol.alias];
        if (!effect) return;

        switch (effect.effectType) {
            case 'adjacencyDestruction':
                this.destroy(adjSymbol, grid);
                break;
            case 'adjacencyBonus':
                this.applyBonus(adjSymbol, effect.params.bonusAmount); // Correctly pass bonusAmount
                break;
            case 'transformation':
                this.transform(adjSymbol, grid, effect.params);
                break;
            case 'ageEgg':
                this.ageEgg(adjSymbol, grid, effect.params);
                break;
            case 'bankDeposit':
                this.bankDeposit(adjSymbol, grid, effect.params);
                break;
            // Add more interaction types here
            default:
                console.log("No such adjacency effect defined.");
        }
    }

    applyGlobalEffects(grid, rowIndex) { // Add rowIndex parameter
        this.globalEffects.forEach(effect => {
            switch (effect.effectType) {
                case 'totalMultiplier':
                    this.basePayout += grid.countSymbols(this.alias) * effect.params.multiplier;
                    break;
                case 'rowMultiplier':
                    // Use rowIndex, NOT effect.params.row
                    this.basePayout += grid.countSymbolsInRow(this.alias, rowIndex) * effect.params.multiplier;
                    break;
                case 'ageSymbol':
                    this.age++;
                    if (this.age >= effect.params.matureAge) {
                        this.transformWhenMature(grid, effect.params);
                    }
                    break;
                case 'harvestValue':
                    // For symbols that accumulate value over turns
                    this.storedValue += effect.params.valuePerTurn;
                    this.basePayout = effect.params.baseValue + this.storedValue;
                    break;
                // Add more global effect types
            }
        });
    }

    transformWhenMature(grid, params) {
        // Check if the egg is mature enough to transform
        if (this.age >= params.matureAge) {
            console.log(`${this.alias} is transforming to ${params.transformTo}!`);
            
            // Find this symbol in the grid
            for (let row = 0; row < grid.rows; row++) {
                for (let col = 0; col < grid.columns; col++) {
                    if (grid.grid[row][col] === this) {
                        // Create visual transformation effect
                        const reelElement = document.getElementById(`reel${row}${col}`);
                        if (reelElement) {
                            const symbolElement = reelElement.querySelector('.symbol');
                            
                            // Visual transformation effect
                            symbolElement.classList.add('transforming');
                            
                            // Change the symbol
                            setTimeout(() => {
                                symbolElement.textContent = params.transformToUnicode;
                                
                                // Create a transformation effect
                                const transformEffect = document.createElement('div');
                                transformEffect.className = 'transform-effect';
                                reelElement.appendChild(transformEffect);
                                
                                setTimeout(() => {
                                    symbolElement.classList.remove('transforming');
                                    transformEffect.remove();
                                }, 1000);
                            }, 500);
                        }
                        
                        // Replace in player's inventory and grid
                        grid.player.removeSymbol(this.alias);
                        grid.player.addSymbol(params.transformTo);
                        grid.grid[row][col] = grid.player.getInventorySymbols().find(s => s.alias === params.transformTo);
                        return;
                    }
                }
            }
        }
    }

    transform(adjacentSymbol, grid, params) {
        console.log(`${adjacentSymbol.alias} is transforming!`);
        
        // Find the adjacent symbol in the grid
        for (let row = 0; row < grid.rows; row++) {
            for (let col = 0; col < grid.columns; col++) {
                if (grid.grid[row][col] === adjacentSymbol) {
                    // Visual effect for transformation
                    const reelElement = document.getElementById(`reel${row}${col}`);
                    if (reelElement) {
                        const symbolElement = reelElement.querySelector('.symbol');
                        
                        // Choose random transformation if there are multiple options
                        let transformTo;
                        if (Array.isArray(params.transformsInto)) {
                            transformTo = params.transformsInto[Math.floor(Math.random() * params.transformsInto.length)];
                        } else {
                            transformTo = params.transformsInto;
                        }
                        
                        // Animation effect
                        symbolElement.classList.add('transforming');
                        
                        setTimeout(() => {
                            symbolElement.textContent = transformTo;
                            
                            // Create floating transformation text
                            const transformText = document.createElement('div');
                            transformText.className = 'transform-text';
                            transformText.textContent = "Transform!";
                            reelElement.appendChild(transformText);
                            
                            setTimeout(() => {
                                symbolElement.classList.remove('transforming');
                                transformText.remove();
                            }, 1000);
                        }, 500);
                    }
                    
                    // Update the player's inventory and grid
                    grid.player.removeSymbol(adjacentSymbol.alias);
                    
                    // Add the new transformed symbol if specified
                    if (params.newSymbolAlias) {
                        grid.player.addSymbol(params.newSymbolAlias);
                        grid.grid[row][col] = grid.player.getInventorySymbols().find(s => s.alias === params.newSymbolAlias);
                    } else {
                        grid.grid[row][col] = null; // Just remove if no replacement specified
                    }
                    return;
                }
            }
        }
    }

    ageEgg(adjacentSymbol, grid, params) {
        // Only age eggs if they're adjacent
        if (adjacentSymbol.alias === 'egg') {
            adjacentSymbol.age++;
            console.log(`Egg aged to ${adjacentSymbol.age}`);
            
            // Find the egg in the grid
            for (let row = 0; row < grid.rows; row++) {
                for (let col = 0; col < grid.columns; col++) {
                    if (grid.grid[row][col] === adjacentSymbol) {
                        const reelElement = document.getElementById(`reel${row}${col}`);
                        if (reelElement) {
                            // Visual aging effect
                            const ageIndicator = document.createElement('div');
                            ageIndicator.className = 'age-indicator';
                            ageIndicator.textContent = adjacentSymbol.age;
                            reelElement.appendChild(ageIndicator);
                            
                            setTimeout(() => ageIndicator.remove(), 1500);
                            
                            // Check if egg is ready to hatch
                            if (adjacentSymbol.age >= params.hatchAge) {
                                this.hatchEgg(adjacentSymbol, grid, row, col, params);
                            }
                        }
                        return;
                    }
                }
            }
        }
    }

    hatchEgg(eggSymbol, grid, row, col, params) {
        console.log(`Egg is hatching into ${params.hatchesInto}!`);
        
        const reelElement = document.getElementById(`reel${row}${col}`);
        if (reelElement) {
            const symbolElement = reelElement.querySelector('.symbol');
            
            // Hatching animation
            symbolElement.classList.add('hatching');
            
            setTimeout(() => {
                symbolElement.textContent = params.hatchesIntoUnicode;
                
                // Create hatching effect
                const hatchEffect = document.createElement('div');
                hatchEffect.className = 'hatch-effect';
                hatchEffect.textContent = "🐣";
                reelElement.appendChild(hatchEffect);
                
                setTimeout(() => {
                    symbolElement.classList.remove('hatching');
                    hatchEffect.remove();
                }, 1000);
            }, 500);
        }
        
        // Update the player's inventory and grid
        grid.player.removeSymbol('egg');
        grid.player.addSymbol(params.hatchesInto);
        grid.grid[row][col] = grid.player.getInventorySymbols().find(s => s.alias === params.hatchesInto);
    }

    bankDeposit(coinSymbol, grid, params) {
        if (coinSymbol.alias === 'goldenCoin' || coinSymbol.alias === 'coin') {
            console.log(`Bank collects ${coinSymbol.alias}`);
            
            // Find the coin in the grid
            for (let row = 0; row < grid.rows; row++) {
                for (let col = 0; col < grid.columns; col++) {
                    if (grid.grid[row][col] === coinSymbol) {
                        const reelElement = document.getElementById(`reel${row}${col}`);
                        if (reelElement) {
                            const symbolElement = reelElement.querySelector('.symbol');
                            
                            // Visual coin collection animation
                            symbolElement.classList.add('coin-collected');
                            
                            // Create coin path to bank
                            for (let bankRow = 0; bankRow < grid.rows; bankRow++) {
                                for (let bankCol = 0; bankCol < grid.columns; bankCol++) {
                                    if (grid.grid[bankRow][bankCol] === this) { // 'this' is the bank
                                        const bankElement = document.getElementById(`reel${bankRow}${bankCol}`);
                                        if (bankElement) {
                                            // Create coin path effect
                                            const coinPath = document.createElement('div');
                                            coinPath.className = 'coin-path';
                                            document.body.appendChild(coinPath);
                                            
                                            // Calculate positions
                                            const coinRect = reelElement.getBoundingClientRect();
                                            const bankRect = bankElement.getBoundingClientRect();
                                            
                                            coinPath.style.left = `${coinRect.left + coinRect.width/2}px`;
                                            coinPath.style.top = `${coinRect.top + coinRect.height/2}px`;
                                            
                                            // Animate coin to bank
                                            setTimeout(() => {
                                                coinPath.style.transform = `translate(
                                                    ${bankRect.left - coinRect.left}px, 
                                                    ${bankRect.top - coinRect.top}px
                                                )`;
                                                
                                                // Increment bank balance
                                                this.bankBalance += coinSymbol.basePayout;
                                                this.basePayout = params.baseInterest * this.bankBalance;
                                                
                                                // Show bank balance update
                                                setTimeout(() => {
                                                    const balanceIndicator = document.createElement('div');
                                                    balanceIndicator.className = 'bank-balance';
                                                    balanceIndicator.textContent = `Balance: ${this.bankBalance}`;
                                                    bankElement.appendChild(balanceIndicator);
                                                    
                                                    // Cleanup
                                                    setTimeout(() => {
                                                        balanceIndicator.remove();
                                                        coinPath.remove();
                                                    }, 1500);
                                                }, 500);
                                            }, 100);
                                        }
                                    }
                                }
                            }
                            
                            // Remove the coin after animation
                            setTimeout(() => {
                                symbolElement.classList.remove('coin-collected');
                                grid.removeSymbol(coinSymbol);
                            }, 1500);
                        }
                        return;
                    }
                }
            }
        }
    }

    destroy(symbol, grid) {
        console.log(`${this.alias} destroys ${symbol.alias}.`); // Show destruction log
    
        const reelElement = document.getElementById(`reel${symbol.row}${symbol.col}`);
        if (reelElement) {
            const symbolElement = reelElement.querySelector('.symbol');
    
            // Add fade-out animation before removing the symbol
            symbolElement.classList.add('milk-destroyed');
    
            // Delay removal until after the animation
            setTimeout(() => {
                this.basePayout += symbol.basePayout; // Add destroyed symbol's payout
                setTimeout(() => {
                    grid.removeSymbol(symbol);
                }, 1000); // Now actually remove it
                symbolElement.textContent = ""; // Visually clear it
            }, 1000); // Wait 1 second for the animation to finish
        }
    }

    applyBonus(adjacentSymbol, bonusAmount) { // Corrected parameter name
        console.log(`Bonus applied between ${this.alias} and ${adjacentSymbol.alias}`);
        this.basePayout += bonusAmount; // Add the bonus
    }

    render() {
        return this.unicode;
    }
}

export default GameSymbol;