import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';
import { Card, Rank } from 'deckjs';

export default class Hand {
  public static isSoft (cards:Card[]) {
    return cards.length === 2 && Hand.hasAce(cards);
  }

  public static isHard (cards:Card[]) {
    return cards.length === 2 && !Hand.hasAce(cards)
  }

  public static hasAce (cards:Card[]) {
    return cards.some(Hand.isAceValue)
  }

  public static isAceValue (card:Card) {
    return card.blackjackValue === 0;
  }

  public static hasBlackjack (values:number[]) {
    return values.some(x => x === 21)
  }

  public static isCardTen (card:Card) {
    return card.rank === Rank.Ten ||
           card.rank === Rank.Jack ||
           card.rank === Rank.Queen ||
           card.rank === Rank.King
  }

  public static isNatural (cards:Card[]) {
    if (cards.length > 2) { return false }
    return (cards[0].rank === Rank.Ace && Hand.isCardTen(cards[1])) ||
           (cards[1].rank === Rank.Ace && Hand.isCardTen(cards[0]))
  }

  public static checkHandBust (values:number[]) {
    return values.filter(x => x <= 21).length === values.length
  }

  public static getHands (cards:Card[]) {
    const results:Card[][] = [];
    Hand.getHandsHelper(cards, results)
    if (results.length === 0) {
      results.push(cards)
    }
    return results
  }

  public static getHandsHelper (cards:Card[], results:Card[][], start:number = 0) {
    for (let i = start; i < cards.length; i++) {
      if (Hand.isAceValue(cards[i])) {
        const cardsLow = cloneDeep(cards)
        cardsLow[i].setBlackjackValue(1);
        const cardsHigh = cloneDeep(cards)
        cardsHigh[i].setBlackjackValue(11);
        if (!cardsLow.find(c => c.blackjackValue === 0)) {
          results.push(cardsLow)
        } else {
          Hand.getHandsHelper(cardsLow, results, i+1)
        }
        if (!cardsHigh.find(c => c.blackjackValue === 0)) {
          results.push(cardsHigh)
        } else {
          Hand.getHandsHelper(cardsHigh, results, i+1)
        }
      }
    }
  }

  public static getHandValue (cards:Card[]) {
    return cards.reduce((acc, card) => acc + card.blackjackValue, 0)
  }

  public static getHandValues (cards:Card[]) {
    const handsList = Hand.getHands(cards)
    const handValues = handsList.map(list => Hand.getHandValue(list))
    return sortBy(uniq(handValues));
  }
}
