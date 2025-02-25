// player.js

import Game from "./game.js";
import GameSymbol from "./gameSymbol.js";
import symbols from './symbol_list.js';

class Player {
  constructor() {
      this.inventory = ['cat', 'milk', 'dog', 'bone']; // Reduced starting symbols for more challenge
      this.wallet = 20; // Reduced starting money
      this.bonusItems = [];
      this.game = null; // Add a game property
  }
  //add this method
  setGame(gameInstance)
  {
      this.game = gameInstance;
  }

  getInventorySymbols() {
      return this.inventory.map(alias => symbols[alias]);
  }

   addSymbol(alias) {
      if (symbols[alias]) {
          this.inventory.push(alias);
          console.log(`${alias} added to inventory.  Inventory is now:`, this.inventory); // Debugging
          if (this.game) {
              this.game.updateUI();  // Call game.updateUI()
          }

      } else {
          console.error(`Symbol with alias ${alias} does not exist.`);
      }
  }

  removeSymbol(alias) {
      const index = this.inventory.indexOf(alias);
      if (index !== -1) {
          this.inventory.splice(index, 1);
          console.log("Removed symbol:", alias, "Inventory:", this.inventory); // Debugging
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
      if (moneyDisplay) { // Check if the element exists
          moneyDisplay.textContent = `Money: ${this.wallet}`;
      }
  }
}

export default Player;