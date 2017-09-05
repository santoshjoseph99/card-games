let Card = require('./card');

module.exports = class Deck {
  constructor(numOfDecks, jokersPerDeck) {
    if(!jokersPerDeck) {
      jokersPerDeck = 0;
    }
    this.init(numOfDecks, jokersPerDeck);
  }

  init(numOfDecks, jokersPerDeck) {
    this.index = 0;
    this.cards = new Array(52*numOfDecks);
    for(let i = 0; i < numOfDecks; i++) {
      let startIdx = i * 52;
      this.cards[startIdx + 0] = new Card('a', 's');
      this.cards[startIdx + 1] = new Card('2', 's');
      this.cards[startIdx + 2] = new Card('3', 's');
      this.cards[startIdx + 3] = new Card('4', 's');
      this.cards[startIdx + 4] = new Card('5', 's');
      this.cards[startIdx + 5] = new Card('6', 's');
      this.cards[startIdx + 6] = new Card('7', 's');
      this.cards[startIdx + 7] = new Card('8', 's');
      this.cards[startIdx + 8] = new Card('9', 's');
      this.cards[startIdx + 9] = new Card('10', 's');
      this.cards[startIdx + 10] = new Card('j', 's');
      this.cards[startIdx + 11] = new Card('q', 's');
      this.cards[startIdx + 12] = new Card('k', 's');

      this.cards[startIdx + 13] = new Card('a', 'c');
      this.cards[startIdx + 14] = new Card('2', 'c');
      this.cards[startIdx + 15] = new Card('3', 'c');
      this.cards[startIdx + 16] = new Card('4', 'c');
      this.cards[startIdx + 17] = new Card('5', 'c');
      this.cards[startIdx + 18] = new Card('6', 'c');
      this.cards[startIdx + 19] = new Card('7', 'c');
      this.cards[startIdx + 20] = new Card('8', 'c');
      this.cards[startIdx + 21] = new Card('9', 'c');
      this.cards[startIdx + 22] = new Card('10', 'c');
      this.cards[startIdx + 23] = new Card('j', 'c');
      this.cards[startIdx + 24] = new Card('q', 'c');
      this.cards[startIdx + 25] = new Card('k', 'c');

      this.cards[startIdx + 26] = new Card('a', 'h');
      this.cards[startIdx + 27] = new Card('2', 'h');
      this.cards[startIdx + 28] = new Card('3', 'h');
      this.cards[startIdx + 29] = new Card('4', 'h');
      this.cards[startIdx + 30] = new Card('5', 'h');
      this.cards[startIdx + 31] = new Card('6', 'h');
      this.cards[startIdx + 32] = new Card('7', 'h');
      this.cards[startIdx + 33] = new Card('8', 'h');
      this.cards[startIdx + 34] = new Card('9', 'h');
      this.cards[startIdx + 35] = new Card('10', 'h');
      this.cards[startIdx + 36] = new Card('j', 'h');
      this.cards[startIdx + 37] = new Card('q', 'h');
      this.cards[startIdx + 38] = new Card('k', 'h');

      this.cards[startIdx + 39] = new Card('a', 'd');
      this.cards[startIdx + 40] = new Card('2', 'd');
      this.cards[startIdx + 41] = new Card('3', 'd');
      this.cards[startIdx + 42] = new Card('4', 'd');
      this.cards[startIdx + 43] = new Card('5', 'd');
      this.cards[startIdx + 44] = new Card('6', 'd');
      this.cards[startIdx + 45] = new Card('7', 'd');
      this.cards[startIdx + 46] = new Card('8', 'd');
      this.cards[startIdx + 47] = new Card('9', 'd');
      this.cards[startIdx + 48] = new Card('10', 'd');
      this.cards[startIdx + 49] = new Card('j', 'd');
      this.cards[startIdx + 50] = new Card('q', 'd');
      this.cards[startIdx + 51] = new Card('k', 'd');
    }
    for(let i = 0; i < numOfDecks*jokersPerDeck; i++){
      this.cards.push(new Card('j', 'j'));
    }
  }

  getCard() {
    if (this.index > this.cards.length - 1) {
      return undefined;
    }
    return this.cards[this.index++];
  }

  shuffle() {
    this.index = 0;
    for(let i = 0; i < this.cards.length; i++){
      const x = Math.floor(Math.random() * this.cards.length);
      const t = this.cards[i];
      this.cards[i] = this.cards[x];
      this.cards[x] = t;
    }
  }
};
