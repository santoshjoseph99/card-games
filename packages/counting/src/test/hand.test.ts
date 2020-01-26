var chai = require('chai');
var expect = require('chai').expect;
import Hand from '../../lib/hand';
import { Card, Rank, Suit } from 'deckjs';

describe('Hand', function () {
  context('.isSoft', function () {
    it('return true with 2 cards and ace', function () {
      const cards = [
        new Card(Rank.Ace, Suit.Club),
        new Card(Rank.Eight, Suit.Club)
      ];
      expect(Hand.isSoft(cards)).to.be.true;
    });
    it('return false with 3 cards and ace', function () {
      const cards = [
        new Card(Rank.Ace, Suit.Club),
        new Card(Rank.Eight, Suit.Club),
        new Card(Rank.Eight, Suit.Club)
      ];
      expect(Hand.isSoft(cards)).to.be.false;
    });
    it('return false with 2 cards and no ace', function () {
      const cards = [
        new Card(Rank.Eight, Suit.Club),
        new Card(Rank.Eight, Suit.Club)
      ];
      expect(Hand.isSoft(cards)).to.be.false;
    });
  });
  context('.isHard', function () {
    it('return false with 2 cards and ace', function () {
      const cards = [
        new Card(Rank.Ace, Suit.Club),
        new Card(Rank.Eight, Suit.Club)
      ];
      expect(Hand.isHard(cards)).to.be.false;
    });
    it('return true with 2 cards and no ace', function () {
      const cards = [
        new Card(Rank.Eight, Suit.Club),
        new Card(Rank.Eight, Suit.Club)
      ];
      expect(Hand.isHard(cards)).to.be.true;
    });
  });
  context('.hasAce', function () {
    it('returns false with no ace', () => {
      const cards = [
        new Card(Rank.Eight, Suit.Club),
        new Card(Rank.Eight, Suit.Club)
      ];
      expect(Hand.hasAce(cards)).to.be.false;
    });
    it('returns true with ace', () => {
      const cards = [
        new Card(Rank.Eight, Suit.Club),
        new Card(Rank.Ace, Suit.Club)
      ];
      expect(Hand.hasAce(cards)).to.be.true;
    });
  });
  context('.getHands', () => {
    it('returns the same list if no ace', () => {
      const cards = [
        new Card(Rank.Eight, Suit.Club),
        new Card(Rank.Nine, Suit.Club)
      ];
      const result = Hand.getHands(cards);
      expect(result).to.have.length(1);
      expect(result[0]).to.have.members(cards);
    });
    it('returns 2 lists with 1 ace', () => {
      const cards = [
        new Card(Rank.Eight, Suit.Club),
        new Card(Rank.Ace, Suit.Club)
      ];
      const result = Hand.getHands(cards);
      expect(result).to.have.length(2);
      expect(Hand.getHandValue(result[0])).to.equal(9);
      expect(Hand.getHandValue(result[1])).to.equal(19);
    });
    it('returns 4 lists with 2 aces', () => {
      const cards = [
        new Card(Rank.Eight, Suit.Club),
        new Card(Rank.Ace, Suit.Club),
        new Card(Rank.Ace, Suit.Spade)
      ];
      const result = Hand.getHands(cards);
      expect(result).to.have.length(4);
      expect(Hand.getHandValue(result[0])).to.equal(10);
      expect(Hand.getHandValue(result[1])).to.equal(20);
      expect(Hand.getHandValue(result[2])).to.equal(20);
      expect(Hand.getHandValue(result[3])).to.equal(30);
    });
    it('returns 8 lists with 3 aces', () => {
      const cards = [
        new Card(Rank.Eight, Suit.Club),
        new Card(Rank.Ace, Suit.Club),
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.Ace, Suit.Diamond)
      ];
      const result = Hand.getHands(cards);
      expect(result).to.have.length(8);
      /*
      8 a a a
        8 1 a a
          8 1 1 a
            8 1 1 1
            8 1 1 11
          8 1 11 a
            8 1 11 1
            8 1 11 11
        8 11 a a
          8 11 1 a
            8 11 1 1
            8 11 1 11
          8 11 11 a
            8 11 11 1
            8 11 11 11
      */
      expect(Hand.getHandValue(result[0])).to.equal(11);
      expect(Hand.getHandValue(result[1])).to.equal(21);
      expect(Hand.getHandValue(result[2])).to.equal(21);
      expect(Hand.getHandValue(result[3])).to.equal(31);
      expect(Hand.getHandValue(result[4])).to.equal(21);
      expect(Hand.getHandValue(result[5])).to.equal(31);
      expect(Hand.getHandValue(result[6])).to.equal(31);
      expect(Hand.getHandValue(result[7])).to.equal(41);
    });
  });
  context('.getHandValues', () => {
    it('returns uniq ascending values', () => {
      const cards = [
        new Card(Rank.Eight, Suit.Club),
        new Card(Rank.Ace, Suit.Club),
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.Ace, Suit.Diamond)
      ];
      const result = Hand.getHandValues(cards);
      expect(result.length).to.equal(4);
      expect(result[0]).to.equal(11);
      expect(result[1]).to.equal(21);
      expect(result[2]).to.equal(31);
      expect(result[3]).to.equal(41);
    })
  })
});
