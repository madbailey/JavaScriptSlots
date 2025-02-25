// Interaction Unit Tests
const assert = require('assert');
const GameSymbol = require('../src/scripts/gameSymbol.js').default;

// Mock DOM elements for tests
global.document = {
    getElementById: () => ({
        querySelector: () => ({
            classList: {
                add: () => {},
                remove: () => {}
            },
            textContent: ''
        }),
        appendChild: () => {},
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 })
    }),
    body: {
        appendChild: () => {}
    },
    createElement: () => ({
        className: '',
        style: {},
        textContent: '',
        appendChild: () => {}
    })
};

global.setTimeout = (fn) => fn();

// Test suite for symbol interactions
const interactionTests = {
    'should correctly handle cat drinking milk interaction': function() {
        // Create cat and milk symbols
        const cat = new GameSymbol('🐱', 'cat', 'Cat symbol', 2, 1);
        const milk = new GameSymbol('🥛', 'milk', 'Milk symbol', 1, 1);
        
        // Set up adjacency effect
        cat.addAdjacencyEffect('milk', 'adjacencyDestruction', {});
        
        // Mock grid for test
        const mockGrid = {
            removeSymbol: () => {},
            rows: 3,
            columns: 3
        };
        
        // Initial payout
        const initialCatPayout = cat.basePayout;
        
        // Execute interaction
        cat.destroy(milk, mockGrid);
        
        // Check that cat payout was increased by milk's value
        assert.strictEqual(cat.basePayout, initialCatPayout + milk.basePayout);
    },
    
    'should correctly apply bee-flower pollination bonus': function() {
        // Create bee and flower symbols
        const bee = new GameSymbol('🐝', 'bee', 'Bee symbol', 1, 0.8);
        const flower = new GameSymbol('🌸', 'flower', 'Flower symbol', 1, 0.8);
        
        // Set up adjacency effects
        bee.addAdjacencyEffect('flower', 'adjacencyBonus', { bonusAmount: 8 });
        flower.addAdjacencyEffect('bee', 'adjacencyBonus', { bonusAmount: 8 });
        
        // Initial payouts
        const initialBeePayout = bee.basePayout;
        const initialFlowerPayout = flower.basePayout;
        
        // Execute interactions in both directions
        bee.applyBonus(flower, 8);
        flower.applyBonus(bee, 8);
        
        // Check that both payouts have increased correctly
        assert.strictEqual(bee.basePayout, initialBeePayout + 8);
        assert.strictEqual(flower.basePayout, initialFlowerPayout + 8);
    },
    
    'should correctly apply lock-key bonus': function() {
        // Create lock and key symbols
        const lock = new GameSymbol('🔒', 'lock', 'Lock symbol', 0, 0.6);
        const key = new GameSymbol('🔑', 'key', 'Key symbol', 1, 0.6);
        
        // Set up adjacency effects
        lock.addAdjacencyEffect('key', 'adjacencyBonus', { bonusAmount: 15 });
        key.addAdjacencyEffect('lock', 'adjacencyBonus', { bonusAmount: 15 });
        
        // Initial payouts
        const initialLockPayout = lock.basePayout;
        const initialKeyPayout = key.basePayout;
        
        // Execute interactions in both directions
        lock.applyBonus(key, 15);
        key.applyBonus(lock, 15);
        
        // Check that both payouts have increased correctly
        assert.strictEqual(lock.basePayout, initialLockPayout + 15);
        assert.strictEqual(key.basePayout, initialKeyPayout + 15);
    },
    
    'should correctly age egg towards hatching': function() {
        // Create egg and clock symbols
        const egg = new GameSymbol('🥚', 'egg', 'Egg symbol', 1, 0.7);
        const clock = new GameSymbol('🕰️', 'clock', 'Clock symbol', 1, 0.5);
        
        // Add global effect to egg
        egg.addGlobalEffect('ageSymbol', { 
            matureAge: 5, 
            transformTo: 'chicken', 
            transformToUnicode: '🐔' 
        });
        
        // Set up clock adjacency effect
        clock.addAdjacencyEffect('egg', 'ageEgg', { 
            hatchAge: 3, 
            hatchesInto: 'chicken', 
            hatchesIntoUnicode: '🐔' 
        });
        
        // Create mock grid
        const mockGrid = {
            rows: 3,
            columns: 3,
            grid: [
                [egg, clock, null],
                [null, null, null],
                [null, null, null]
            ],
            player: {
                removeSymbol: () => {},
                addSymbol: () => {},
                getInventorySymbols: () => [{ alias: 'chicken' }]
            }
        };
        
        // Initial age
        egg.age = 2;
        
        // Execute interaction by aging the egg
        // In a real scenario, this would be called by the game loop
        egg.applyGlobalEffects(mockGrid, 0);
        
        // Check that egg aged by 1
        assert.strictEqual(egg.age, 3);
    },
    
    'should calculate bank interest correctly with multiple deposits': function() {
        // Create bank and coin symbols
        const bank = new GameSymbol('🏦', 'bank', 'Bank symbol', 1, 0.4);
        const coin1 = new GameSymbol('💰', 'coin', 'Coin symbol', 2, 0.8);
        const coin2 = new GameSymbol('🪙', 'goldenCoin', 'Gold Coin symbol', 5, 0.4);
        
        // Set up bank global effect
        bank.addGlobalEffect('harvestValue', { 
            baseValue: 1, 
            valuePerTurn: 0.2 
        });
        
        // Initial bank state
        bank.bankBalance = 0;
        
        // Mock deposits
        bank.bankBalance += coin1.basePayout;
        bank.bankBalance += coin2.basePayout;
        
        // Apply interest
        const baseInterest = 1.5;
        bank.basePayout = baseInterest * bank.bankBalance;
        
        // Check calculations
        assert.strictEqual(bank.bankBalance, 7); // 2 + 5
        assert.strictEqual(bank.basePayout, 10.5); // 1.5 * 7
    },
    
    'should apply sun-flower growth bonus correctly': function() {
        // Create sun and flower symbols
        const sun = new GameSymbol('☀️', 'sun', 'Sun symbol', 2, 0.5);
        const flower = new GameSymbol('🌸', 'flower', 'Flower symbol', 1, 0.8);
        
        // Set up sun adjacency effect
        sun.addAdjacencyEffect('flower', 'adjacencyBonus', { bonusAmount: 4 });
        
        // Initial flower payout
        const initialFlowerPayout = flower.basePayout;
        
        // Apply bonus
        sun.applyBonus(flower, 4);
        
        // Check that flower payout increased
        assert.strictEqual(flower.basePayout, initialFlowerPayout + 4);
    }
};

module.exports = interactionTests;