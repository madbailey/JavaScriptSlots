import GameSymbol from './gameSymbol.js';

// Create symbol instances
const symbols = {
     cat: new GameSymbol("🐱", "cat", "Friendly feline", 10),
    milk: new GameSymbol("🥛", "milk", "Refreshing drink", 5)
};

// there are currently two types of symbol interactions in the game: destroy and bonusPayout
symbols.cat.addInteraction("milk", "destroy");

// Export the symbol instances for use in other modules
export default symbols;