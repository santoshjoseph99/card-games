let Card = require('./card');

module.exports = class Deck {
  constructor(numOfDecks, jokersPerDeck) {
    if(!numOfDecks) {
      numOfDecks = 1;
    }
    if(!jokersPerDeck) {
      jokersPerDeck = 0;
    }
    this.init(numOfDecks, jokersPerDeck);
  }

  init(numOfDecks, jokersPerDeck) {
    const suits = ['c', 'd', 'h', 's'];
    const ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
    this.cards = [];
    for(let i = 0; i < numOfDecks; i++) {
      for(let s = 0; s < suits.length; s++) {
        for(let r = 0; r < ranks.length; r++) {
          this.cards.push(new Card(ranks[r], suits[s]));
        }
      }
    }
    for(let i = 0; i < numOfDecks*jokersPerDeck; i++){
      this.cards.push(new Card('j', 'j'));
    }
  }

  getCard() {
    return this.cards.pop();
  }

  shuffle() {
    for(let i = 0; i < this.cards.length; i++){
      const x = Math.floor(Math.random() * this.cards.length);
      const t = this.cards[i];
      this.cards[i] = this.cards[x];
      this.cards[x] = t;
    }
  }
};
