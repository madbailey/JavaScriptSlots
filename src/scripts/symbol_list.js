import GameSymbol from './gameSymbol.js';

// Create symbol instances
const symbols = {
    cat: new GameSymbol("🐱", "cat", "Friendly feline", 10, 1),
    milk: new GameSymbol("🥛", "milk", "Refreshing drink", 5, 1),
    dog: new GameSymbol("🐶", "dog", "Loyal companion", 15, 1),
    pirate: new GameSymbol("🏴‍☠️", "pirate", "Treasure hunter", 20, 1)
};

// Define adjacency interactions
// Cat destroys adjacent milk and gets a payout bonus equivalent to milk's base payout
symbols.cat.addAdjacencyEffect("milk", "adjacencyDestruction", {});

// Pirate gets a bonus payout when adjacent to a dog
symbols.pirate.addAdjacencyEffect("dog", "adjacencyBonus", { bonusAmount: 5 });

// Define global effects
// Assume dogs pay out more for each dog present anywhere on the grid
symbols.dog.addGlobalEffect("totalMultiplier", { multiplier: 1 });

// Assume cats pay out more for each cat present on the same row
symbols.cat.addGlobalEffect("rowMultiplier", { multiplier: 2 });

// Export the modified symbol instances for use in other modules
export default symbols;
