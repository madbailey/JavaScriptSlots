// player.js

import Game from "./game.js";
import GameSymbol from "./gameSymbol.js";
import symbols from './symbol_list.js';

class Player {
    constructor() {
        this.inventory = ['cat', 'cat', 'milk']; // Inventory stores aliases
        this.wallet = 25; // Default wallet amount
        this.bonusItems = []; // Any additional items
    }
    getInventorySymbols() {
        return this.inventory.map(alias => symbols[alias]);
    }

    addSymbol(alias) {
        if (symbols[alias]) {
            this.inventory.push(alias);
        } else {
            console.error(`Symbol with alias ${alias} does not exist.`);
        }
    }

    removeSymbol(alias) {
        const index = this.inventory.indexOf(alias);
        if (index !== -1) {
            this.inventory.splice(index, 1);
        } else {
            console.error(`Symbol with alias ${alias} not found in inventory.`);
        }
    }
  
    addMoney(amount) {
        this.wallet += amount;
        this.updateMoneyDisplay();
      }
    
      removeMoney(amount) {
        if (this.wallet >= amount) {
          this.wallet -= amount;
          this.updateMoneyDisplay();
          return true;
        }
        return false;
      }
  
    addBonusItem(item) {
      this.bonusItems.push(item);
    }
  
    removeBonusItem(item) {
      const index = this.bonusItems.indexOf(item);
      if (index !== -1) {
        this.bonusItems.splice(index, 1);
      }
    }
    updateMoneyDisplay() {
        const moneyDisplay = document.getElementById('moneyDisplay');
        moneyDisplay.textContent = `Money: ${this.wallet}`;
      }
  }

  export default Player;  // Export the Player class for use in other modules