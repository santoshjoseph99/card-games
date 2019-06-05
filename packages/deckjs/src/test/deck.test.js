var chai = require('chai');
var expect = require('chai').expect;
var Deck = require('../../lib/deck').default;

function hasNumCardsOfSuit(cards, suite, num) {
  let count = 0;
  for(let i = 0; i < cards.length; i++){
    if(cards[i].suite === suite) {
      count++;
    }
  }
  return num === count;
}

function hasNumOfJokers(cards, num) {
  let count = 0;
  for(let i = 0; i < cards.length; i++){
    if(cards[i].suite === 'j' && cards[i].rank === 'j') {
      count++;
    }
  }
  return num === count;
}

describe('Deck', function() {
  context('one deck no jokers', function(){
    it('has 52 cards', function(){
      let deck = new Deck(1);
      expect(deck.cards).to.have.lengthOf(52);
    });
    it('has no jokers', function(){
      let deck = new Deck(1);
      expect(hasNumOfJokers(deck.cards, 0)).to.be.true;
    });
    it('has 13 cards of each suit', function() {
      let deck = new Deck(1);
      expect(hasNumCardsOfSuit(deck.cards, 'c', 13)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 'd', 13)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 'h', 13)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 's', 13)).to.be.true;
    });
  });
  context('one deck with 2 jokers', function(){
    it('has 54 cards', function(){
      let deck = new Deck(1, 2);
      expect(deck.cards).to.have.lengthOf(54);
    });
    it('has 2 jokers', function() {
      let deck = new Deck(1, 2);
      expect(hasNumOfJokers(deck.cards, 2)).to.be.true;
    });
  });
  context('6 decks with no jokers', function(){
    it('has 6*52 cards', function(){
      let deck = new Deck(6);
      expect(deck.cards).to.have.lengthOf(6*52);
    });
    it('has 13*6 cards of each suit', function () {
      let deck = new Deck(6);
      expect(hasNumCardsOfSuit(deck.cards, 'c', 13*6)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 'd', 13*6)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 'h', 13*6)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 's', 13*6)).to.be.true;
    });
  });
  context('6 decks with 2 jokers in each deck', function(){
    it('has 6*52 + 6*2 cards', function(){
      let deck = new Deck(6, 2);
      expect(deck.cards).to.have.lengthOf(6*52 + 6*2);
    });
    it('has 12 jokers', function() {
      let deck = new Deck(6, 2);
      expect(hasNumOfJokers(deck.cards, 12)).to.be.true;
    });
  });
  describe('.getCard', function(){
    it('returns all cards in the deck', function(){
      let deck = new Deck(1);
      for(let i = 0; i < 52; i++){
        let card = deck.getCard();
        expect(card).to.be.not.undefined;
      }
    });
    it('returns null if asking for more cards', function(){
      let deck = new Deck(1);
      for (let i = 0; i < 52; i++) {
        let card = deck.getCard();
      }
      expect(deck.getCard()).to.be.undefined;
    });
  });
  describe('.shuffle', function(){
    it('shuffles the decks', function(){
      let deck = new Deck(1);
      deck.shuffle();
    });
  });
});