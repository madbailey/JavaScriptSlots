import GameSymbol from './gameSymbol.js';

const symbols = {
    // Existing Symbols
    cat: new GameSymbol("🐱", "cat", "Gives 2 coins. Destroys adjacent Milk for extra payout.", 2, 1),
    milk: new GameSymbol("🥛", "milk", "Gives 1 coin. Can be consumed by a Cat for extra payout.", 1, 1),
    dog: new GameSymbol("🐶", "dog", "Gives 3 coins. Gains extra payout when next to a Bone.", 3, 1),
    pirate: new GameSymbol("🏴‍☠️", "pirate", "Gives 4 coins. Opens adjacent Treasure Chests for bonus gold.", 4, 1),
    treasure: new GameSymbol("💎", "treasure", "Gives 10 coins. A rare find!", 10, 0.5),
    skull: new GameSymbol("💀", "skull", "Gives 0 coins. Gains value from adjacent Ghosts or Wizards.", 0, 0.8),
    clover: new GameSymbol("🍀", "clover", "Gives 1 coin. Boosts adjacent symbols' payouts.", 1, 0.6),
    bone: new GameSymbol("🦴", "bone", "Gives 1 coin. Dogs next to this get a bonus.", 1, 1),
    fish: new GameSymbol("🐟", "fish", "Gives 2 coins. Can be eaten by a Cat for extra payout.", 2, 1),
    ghost: new GameSymbol("👻", "ghost", "Gives 0 coins. Gains extra payout from adjacent Skulls.", 0, 0.7),
    fire: new GameSymbol("🔥", "fire", "Gives 1 coin. Burns and removes adjacent items for extra payout.", 1, 0.8),
    treasureChest: new GameSymbol("🎁", "treasureChest", "Gives 3 coins. A Pirate can open it for a big reward.", 3, 0.5),
    wizard: new GameSymbol("🧙‍♂️", "wizard", "Gives 2 coins. Enhances Skulls, Ghosts, and Fire for extra payout.", 2, 0.6),
    thief: new GameSymbol("🕵️‍♂️", "thief", "Steals 2 coins per spin. A Bounty Hunter can capture it for a big reward.", 0, 0.9),
    bountyHunter: new GameSymbol("🤠", "bountyHunter", "Gives 2 coins. Removes adjacent Thieves for a large payout.", 2, 0.8),
    goldenCoin: new GameSymbol("🪙", "goldenCoin", "Gives 5 coins every spin. Cannot be removed.", 5, 0.4),
    seed: new GameSymbol("🌱", "seed", "Gives 1 coin. Can grow into different plants when next to Water.", 1, 1),
    water: new GameSymbol("💧", "water", "Helps Seeds grow into plants. Disappears after use.", 0, 1)
};

// --- Interactions ---

// Cat drinks Milk
symbols.cat.addAdjacencyEffect("milk", "adjacencyDestruction", {});

// Cat eats Fish
symbols.cat.addAdjacencyEffect("fish", "adjacencyDestruction", { bonusAmount: 4 });

// Dog loves Bone
symbols.dog.addAdjacencyEffect("bone", "adjacencyBonus", { bonusAmount: 3 });

// Ghost becomes stronger when next to a Skull
symbols.ghost.addAdjacencyEffect("skull", "adjacencyBonus", { bonusAmount: 5 });

// Fire burns adjacent Milk, Fish, and Bones but doubles payout
symbols.fire.addAdjacencyEffect("milk", "adjacencyDestruction", { bonusAmount: 2 });
symbols.fire.addAdjacencyEffect("fish", "adjacencyDestruction", { bonusAmount: 4 });
symbols.fire.addAdjacencyEffect("bone", "adjacencyDestruction", { bonusAmount: 3 });

// Pirate opens Treasure Chest
symbols.pirate.addAdjacencyEffect("treasureChest", "adjacencyDestruction", { bonusAmount: 10 });

// Wizard enhances Skulls, Ghosts, and Fire
symbols.wizard.addAdjacencyEffect("skull", "adjacencyBonus", { bonusAmount: 3 });
symbols.wizard.addAdjacencyEffect("ghost", "adjacencyBonus", { bonusAmount: 3 });
symbols.wizard.addAdjacencyEffect("fire", "adjacencyBonus", { bonusAmount: 3 });

// Thief steals 2 coins per spin
symbols.thief.addGlobalEffect("stealMoney", { amount: 2 });

// Bounty Hunter captures Thief, removing it and granting 20 coins
symbols.bountyHunter.addAdjacencyEffect("thief", "adjacencyDestruction", { bonusAmount: 20 });

// Clover boosts adjacent symbols
for (let key in symbols) {
    if (key !== "clover") {
        symbols.clover.addAdjacencyEffect(key, "adjacencyBonus", { bonusAmount: 2 });
    }
}

// Seed grows into a random plant when next to Water

symbols.water.addAdjacencyEffect("seed", "transformation", { transformsInto: ["🍎", "🍌", "🍇", "🌳"] });


symbols.water.addAdjacencyEffect("", "adjacencyDestruction", {});

export default symbols;
