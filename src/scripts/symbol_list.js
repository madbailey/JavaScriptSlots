import GameSymbol from './gameSymbol.js';

// Create symbol instances
const symbols = {
     cat: new GameSymbol("🐱", "cat", "Friendly feline", 10),
    milk: new GameSymbol("🥛", "milk", "Refreshing drink", 5),
    dog: new GameSymbol("🐶", "dog", "Loyal companion", 15),
    pirate: new GameSymbol("🏴‍☠️", "pirate", "Treasure hunter", 20)
};

// there are currently two types of symbol interactions in the game: destroy and bonusPayout
symbols.cat.addInteraction("milk", "destroy");
symbols.dog.addInteraction("cat", "destroy");
symbols.pirate.addInteraction("dog", "bonusPayout", { multiplier: 2 });

// Export the symbol instances for use in other modules
export default symbols;