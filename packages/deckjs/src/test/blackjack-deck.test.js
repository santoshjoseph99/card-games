var chai = require('chai');
var expect = require('chai').expect;
var BlackjackDeck = require('../../lib/blackjack-deck').default;
var ShuffleCard = require('../../lib/blackjack-deck').ShuffleCard;

describe('Blackjack Deck', function() {
  it('getCard returns ShuffleCard after 5th card', () => {
    const deck = new BlackjackDeck(3, 5);
    let lastCard = 6;
    while(--lastCard) {
      deck.getCard();
    }
    expect(deck.getCard()).equal(ShuffleCard);
  });

  it('getCard returns ShuffleCard at 10 cards to the end by default', () => {
    const deck = new BlackjackDeck(1);
    let lastCard = 43;
    while(--lastCard) {
      deck.getCard();
    }
    expect(deck.getCard()).equal(ShuffleCard);
  })
});