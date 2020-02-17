var chai = require('chai');
var expect = require('chai').expect;
var {Deck, Card, Rank, Suit} = require('../../lib/index');

function hasNumCardsOfSuit(cards, suit, num) {
  let count = 0;
  for(let i = 0; i < cards.length; i++){
    if(cards[i].suit === suit) {
      count++;
    }
  }
  return num === count;
}

function hasNumOfJokers(cards, num) {
  let count = 0;
  for(let i = 0; i < cards.length; i++){
    if(cards[i].suit === 'joker' && cards[i].rank === 'joker') {
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
      expect(hasNumCardsOfSuit(deck.cards, 'club', 13)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 'diamond', 13)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 'heart', 13)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 'spade', 13)).to.be.true;
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
      expect(hasNumCardsOfSuit(deck.cards, 'club', 13*6)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 'diamond', 13*6)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 'heart', 13*6)).to.be.true;
      expect(hasNumCardsOfSuit(deck.cards, 'spade', 13*6)).to.be.true;
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
  describe('.swapCardAt', () => {
    context('1 deck', () => {
      it('swaps card at end', () => {
        const SUT = new Deck(1);
        SUT.swapCardAt(Rank.Ace, Suit.Diamond, 51);
        const card = SUT.getCard();
        expect(card.toShortString()).to.be.equal('ad');
      });
      it('throws an exception for out of range', () => {
        const SUT = new Deck(1);
        expect(() => SUT.swapCardAt(Rank.Ace, Suit.Diamond, 52))
          .to.throw('out of range');
      });
      it('throws if card does not exist', () => {
        const SUT = new Deck(1);
        expect(() => SUT.swapCardAt(Rank.Joker, Suit.Diamond, 51))
          .to.throw('Could not find card');
      });
    });
    context('multiple decks', () => {
      it('swaps card at end', () => {
        const SUT = new Deck(6);
        SUT.swapCardAt(Rank.Ace, Suit.Diamond, 6*52-1);
        const card = SUT.getCard();
        expect(card.toShortString()).to.be.equal('ad');
      });
    });
  });
  describe('.setCards', () => {
    context('1 deck', () => {
      it('adds kings at the end', () => {
        const SUT = new Deck(1);
        SUT.setCards([
          new Card(Rank.King, Suit.Club),
          new Card(Rank.King, Suit.Diamond),
          new Card(Rank.King, Suit.Heart),
          new Card(Rank.King, Suit.Spade)
        ]);
        const card1 = SUT.getCard();
        expect(card1.toShortString()).to.be.equal('kc');
        const card2 = SUT.getCard();
        expect(card2.toShortString()).to.be.equal('kd');
        const card3 = SUT.getCard();
        expect(card3.toShortString()).to.be.equal('kh');
        const card4 = SUT.getCard();
        expect(card4.toShortString()).to.be.equal('ks');
      });
    });
    context('multiple decks', () => {
        const SUT = new Deck(6);
        SUT.setCards([
          new Card(Rank.King, Suit.Club),
          new Card(Rank.King, Suit.Diamond),
          new Card(Rank.King, Suit.Heart),
          new Card(Rank.King, Suit.Spade)
        ]);
        const card1 = SUT.getCard();
        expect(card1.toShortString()).to.be.equal('kc');
        const card2 = SUT.getCard();
        expect(card2.toShortString()).to.be.equal('kd');
        const card3 = SUT.getCard();
        expect(card3.toShortString()).to.be.equal('kh');
        const card4 = SUT.getCard();
        expect(card4.toShortString()).to.be.equal('ks');
    })
  });
});