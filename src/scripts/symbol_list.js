// src/scripts/symbol_list.js (Example - Expand this!)
import GameSymbol from './gameSymbol.js';

const symbols = {
    cat: new GameSymbol("🐱", "cat", "Friendly feline", 2, 1),       // Base payout 2
    milk: new GameSymbol("🥛", "milk", "Refreshing drink", 1, 1),    // Base payout 1
    dog: new GameSymbol("🐶", "dog", "Loyal companion", 3, 1),       // Base payout 3
    pirate: new GameSymbol("🏴‍☠️", "pirate", "Treasure hunter", 4, 1), // Base payout 4
    treasure: new GameSymbol("💎", "treasure", "Shiny!", 10, 0.5),    // Base payout 10, rarer
    skull: new GameSymbol("💀", "skull", "Spooky!", 0, 0.8),        // Base payout 0!  Needs effects.
     clover: new GameSymbol("🍀", "clover", "Lucky!", 1, .6), //base pay 1,
};

// --- Interactions ---

// Cat drinks milk
symbols.cat.addAdjacencyEffect("milk", "adjacencyDestruction", {});

// Pirate and Dog get along
symbols.pirate.addAdjacencyEffect("dog", "adjacencyBonus", { bonusAmount: 3 });

// Dog likes other dogs
symbols.dog.addGlobalEffect("totalMultiplier", { multiplier: 1 });

// Cats like other cats on the *same row*
symbols.cat.addGlobalEffect("rowMultiplier", { multiplier: 2 });

// Skulls are worth more with more skulls
symbols.skull.addGlobalEffect("totalMultiplier", { multiplier: 1 });

//clovers give a flat bonus to adjacent symbols
symbols.clover.addAdjacencyEffect("cat", "adjacencyBonus", { bonusAmount: 2 });
symbols.clover.addAdjacencyEffect("milk", "adjacencyBonus", { bonusAmount: 2 });
symbols.clover.addAdjacencyEffect("dog", "adjacencyBonus", { bonusAmount: 2 });
symbols.clover.addAdjacencyEffect("pirate", "adjacencyBonus", { bonusAmount: 2 });
symbols.clover.addAdjacencyEffect("treasure", "adjacencyBonus", { bonusAmount: 2 });
symbols.clover.addAdjacencyEffect("skull", "adjacencyBonus", { bonusAmount: 2 });

export default symbols;