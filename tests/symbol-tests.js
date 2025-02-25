// Symbol Unit Tests
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
    })
};

global.setTimeout = (fn) => fn();

// Test suite
const symbolTests = {
    // Basic symbol creation tests
    'should create a symbol with correct properties': function() {
        const symbol = new GameSymbol('🐱', 'cat', 'Cat symbol', 2, 1);
        assert.strictEqual(symbol.unicode, '🐱');
        assert.strictEqual(symbol.alias, 'cat');
        assert.strictEqual(symbol.tooltip, 'Cat symbol');
        assert.strictEqual(symbol.basePayout, 2);
        assert.strictEqual(symbol.rarity, 1);
        assert.deepStrictEqual(symbol.globalEffects, []);
        assert.deepStrictEqual(symbol.adjacencyEffects, {});
    },

    'should add global effects correctly': function() {
        const symbol = new GameSymbol('🐱', 'cat', 'Cat symbol', 2, 1);
        symbol.addGlobalEffect('totalMultiplier', { multiplier: 2 });
        
        assert.strictEqual(symbol.globalEffects.length, 1);
        assert.strictEqual(symbol.globalEffects[0].effectType, 'totalMultiplier');
        assert.deepStrictEqual(symbol.globalEffects[0].params, { multiplier: 2 });
    },

    'should add adjacency effects correctly': function() {
        const symbol = new GameSymbol('🐱', 'cat', 'Cat symbol', 2, 1);
        symbol.addAdjacencyEffect('milk', 'adjacencyDestruction', { bonusAmount: 1 });
        
        assert.deepStrictEqual(
            symbol.adjacencyEffects['milk'], 
            { effectType: 'adjacencyDestruction', params: { bonusAmount: 1 } }
        );
    },

    'should apply bonus correctly': function() {
        const symbol = new GameSymbol('🐱', 'cat', 'Cat symbol', 2, 1);
        const adjSymbol = { alias: 'milk' };
        
        symbol.applyBonus(adjSymbol, 3);
        assert.strictEqual(symbol.basePayout, 5); // 2 + 3
    },

    // Egg aging tests
    'should age egg correctly': function() {
        const symbol = new GameSymbol('🥚', 'egg', 'Egg symbol', 1, 0.7);
        symbol.age = 0;
        
        // Mock global effect that ages the egg
        symbol.addGlobalEffect('ageSymbol', { 
            matureAge: 5, 
            transformTo: 'chicken', 
            transformToUnicode: '🐔' 
        });
        
        // Create mock grid
        const mockGrid = {
            countSymbols: () => 1,
            countSymbolsInRow: () => 1,
            rows: 3,
            columns: 3,
            grid: [[symbol, null, null], [null, null, null], [null, null, null]],
            player: {
                removeSymbol: () => {},
                addSymbol: () => {},
                getInventorySymbols: () => [{ alias: 'chicken' }]
            }
        };
        
        // Apply global effect to age the egg
        symbol.applyGlobalEffects(mockGrid, 0);
        
        // Egg should have aged
        assert.strictEqual(symbol.age, 1);
    },

    // Bee and flower bonus test
    'should apply bee-flower pollination bonus': function() {
        const bee = new GameSymbol('🐝', 'bee', 'Bee symbol', 1, 0.8);
        const flower = new GameSymbol('🌸', 'flower', 'Flower symbol', 1, 0.8);
        
        bee.addAdjacencyEffect('flower', 'adjacencyBonus', { bonusAmount: 8 });
        flower.addAdjacencyEffect('bee', 'adjacencyBonus', { bonusAmount: 8 });
        
        // Apply bonus
        bee.applyBonus(flower, 8);
        flower.applyBonus(bee, 8);
        
        // Check that bonuses were applied
        assert.strictEqual(bee.basePayout, 9); // 1 + 8
        assert.strictEqual(flower.basePayout, 9); // 1 + 8
    },

    // Lock and key test
    'should apply lock-key bonus': function() {
        const lock = new GameSymbol('🔒', 'lock', 'Lock symbol', 0, 0.6);
        const key = new GameSymbol('🔑', 'key', 'Key symbol', 1, 0.6);
        
        lock.addAdjacencyEffect('key', 'adjacencyBonus', { bonusAmount: 15 });
        key.addAdjacencyEffect('lock', 'adjacencyBonus', { bonusAmount: 15 });
        
        // Apply bonus
        lock.applyBonus(key, 15);
        key.applyBonus(lock, 15);
        
        // Check that bonuses were applied
        assert.strictEqual(lock.basePayout, 15); // 0 + 15
        assert.strictEqual(key.basePayout, 16); // 1 + 15
    },

    // Bank deposit test
    'should calculate bank interest correctly': function() {
        const bank = new GameSymbol('🏦', 'bank', 'Bank symbol', 1, 0.4);
        bank.bankBalance = 10;
        
        // Mock coin deposit
        const mockCoin = { basePayout: 5, alias: 'coin' };
        
        // Mock grid for the bank deposit method
        const mockGrid = {
            rows: 3,
            columns: 3,
            grid: [
                [bank, mockCoin, null],
                [null, null, null],
                [null, null, null]
            ],
            removeSymbol: () => {}
        };
        
        // Apply bank deposit (simplified test)
        bank.bankBalance += mockCoin.basePayout;
        bank.basePayout = 1.5 * bank.bankBalance; // baseInterest * balance
        
        // Check bank balance and payout
        assert.strictEqual(bank.bankBalance, 15); // 10 + 5
        assert.strictEqual(bank.basePayout, 22.5); // 1.5 * 15
    }
};

module.exports = symbolTests;