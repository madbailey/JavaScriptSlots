class GameSymbol {
    constructor(unicode, alias, tooltip, basePayout, rarity) {
        this.unicode = unicode;
        this.alias = alias;
        this.tooltip = tooltip;
        this.basePayout = basePayout;
        this.rarity = rarity; 
        this.globalEffects = [];
        this.adjacencyEffects = {};
    }

    // Add global effects
    addGlobalEffect(effectType, params) {
        this.globalEffects.push({ effectType, params });
    }

    // Define adjacency effects
    addAdjacencyEffect(adjSymbolAlias, effectType, params) {
        this.adjacencyEffects[adjSymbolAlias] = { effectType, params };
    }

    // Execute adjacency effects with another symbol
    executeInteraction(adjSymbol, grid) {
        let effect = this.adjacencyEffects[adjSymbol.alias];
        if (!effect) return;

        switch (effect.effectType) {
            case 'adjacencyDestruction':
                this.destroy(adjSymbol, grid);
                break;
            case 'adjacencyBonus':
                this.applyBonus(adjSymbol, effect.params.bonusAmount);
                break;
            default:
                console.log("No such adjacency effect defined.");
        }
    }

    // Apply all global effects based on the current grid
    applyGlobalEffects(grid) {
        this.globalEffects.forEach(effect => {
            switch (effect.effectType) {
                case 'totalMultiplier':
                    this.basePayout += grid.countSymbols(this.alias) * effect.params.multiplier;
                    break;
                case 'rowMultiplier':
                    this.basePayout += grid.countSymbolsInRow(this.alias, effect.params.row) * effect.params.multiplier;
                    break;
            }
        });
    }

    destroy(symbol, grid) {
        console.log(`${symbol.alias} triggers destruction.`);
        grid.removeSymbol(symbol);  // Assuming a method to remove the symbol from the grid
        this.basePayout += symbol.basePayout; // Optional: add destroyed symbol's payout to this symbol
    }

    applyBonus(symbol, bonusAmount) {
        console.log(`Bonus applied between ${this.alias} and ${symbol.alias}`);
        this.basePayout += bonusAmount;
    }

render() {
    return this.unicode;
}

executeInteraction(adjSymbol, grid, position) {
    let effect = this.adjacencyEffects[adjSymbol.alias];
    if (!effect) return;

    // Create visual effect container
    const effectElement = document.createElement('div');
    effectElement.className = 'interaction-effect';
    
    switch (effect.effectType) {
        case 'adjacencyDestruction':
            // Visualize cat drinking milk
            if (this.alias === 'cat' && adjSymbol.alias === 'milk') {
                effectElement.innerHTML = '💫';
                this.animateDestruction(adjSymbol, grid, position, effectElement);
            }
            break;
            
        case 'adjacencyBonus':
            // Visualize pirate and dog interaction
            if (this.alias === 'pirate' && adjSymbol.alias === 'dog') {
                effectElement.innerHTML = '⭐';
                this.animateBonus(effect.params.bonusAmount, position, effectElement);
            }
            break;
    }
}

animateDestruction(symbol, grid, position, effectElement) {
    const reelElement = document.getElementById(`reel${position.row}${position.col}`);
    reelElement.appendChild(effectElement);
    effectElement.classList.add('interaction-active');

    setTimeout(() => {
        grid.removeSymbol(symbol);
        effectElement.remove();
        
        // Update visual representation
        const symbolElement = reelElement.querySelector('.symbol');
        symbolElement.style.transition = 'opacity 0.5s';
        symbolElement.style.opacity = '0';
    }, 1000);
}

animateBonus(bonusAmount, position, effectElement) {
    const reelElement = document.getElementById(`reel${position.row}${position.col}`);
    reelElement.appendChild(effectElement);
    effectElement.classList.add('interaction-active');

    // Show bonus amount
    const bonusElement = document.createElement('div');
    bonusElement.className = 'payout';
    bonusElement.textContent = `+${bonusAmount}`;
    reelElement.appendChild(bonusElement);

    setTimeout(() => {
        effectElement.remove();
        bonusElement.classList.add('animate');
    }, 1000);
}
}

export default GameSymbol;