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
}
export default GameSymbol;  // Export the GameSymbol class for use in other modules