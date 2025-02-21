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
            // Add more interaction types here (e.g., transformations)
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
                // Add more global effect types
            }
        });
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
                    grid.removeSymbol(adjSymbol);
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