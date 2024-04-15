// Class definition for a game symbol
class GameSymbol {
    constructor(unicode, alias, tooltip, basePayout) {
        this.unicode = unicode;
        this.alias = alias;
        this.tooltip = tooltip;
        this.basePayout = basePayout;
        this.interactions = {};  // Stores interactions with other symbols
    }

    // Add an interaction for this symbol
    addInteraction(otherSymbolAlias, interactionType, params = {}) {
        this.interactions[otherSymbolAlias] = { interactionType, params };
    }

    // Execute an interaction with an adjacent symbol
    executeInteraction(adjSymbol, grid) {
        let interaction = this.interactions[adjSymbol.alias];
        if (!interaction) return;

        switch (interaction.interactionType) {
            case 'destroy':
                destroy(adjSymbol, grid);
                break;
            case 'bonusPayout':
                return bonusPayout(this, interaction.params.multiplier);
            default:
                console.log("No interaction defined.");
        }
    }

    // Render the symbol for the UI
    render() {
        return `${this.unicode} (${this.tooltip})`;
    }
}

// Function to handle the destruction of a symbol
function destroy(symbol, grid) {
    console.log(`${symbol.alias} triggers destruction.`);
    grid.removeSymbol(symbol);  // Assuming a method to remove the symbol from the grid
}

// Function to calculate and apply a bonus payout
function bonusPayout(symbol, multiplier) {
    console.log(`${symbol.alias} triggers a bonus payout.`);
    return symbol.basePayout * multiplier;  // Assume each symbol has a base payout value
}

export default GameSymbol;  // Export the Symbol class for use in other modules
