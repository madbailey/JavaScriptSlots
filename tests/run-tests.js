// Simple test runner
const fs = require('fs');
const path = require('path');

// Import all test files
const symbolTests = require('./symbol-tests.js');
const interactionTests = require('./interaction-tests.js');

// Run all tests
console.log('Running Symbol Tests...');
let passedTests = 0;
let totalTests = 0;

function runTests(testSuite) {
    for (const testName in testSuite) {
        if (typeof testSuite[testName] === 'function') {
            try {
                totalTests++;
                testSuite[testName]();
                console.log(`✅ PASS: ${testName}`);
                passedTests++;
            } catch (error) {
                console.error(`❌ FAIL: ${testName}`);
                console.error(`   Error: ${error.message}`);
            }
        }
    }
}

// Run all test suites
runTests(symbolTests);
runTests(interactionTests);

// Print summary
console.log(`\nTest Summary: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
    console.log('All tests passed! 🎉');
    process.exit(0);
} else {
    console.log('Some tests failed. 😢');
    process.exit(1);
}