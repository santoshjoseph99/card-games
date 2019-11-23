import shuffle from 'lodash/shuffle';
import Card from './card';
import { Rank } from './rank';
import { Suit } from './suit';

export default class Deck {
  private cards: Card[];
  constructor(numOfDecks: number = 1, jokersPerDeck: number = 0) {
    this.cards = [];
    this.init(numOfDecks, jokersPerDeck);
  }

  public init(numOfDecks: number, jokersPerDeck: number): void {
    const suits = [Suit.Club, Suit.Diamond, Suit.Heart, Suit.Spade];
    const ranks = [
      Rank.Ace, Rank.Two, Rank.Three, Rank.Four,
      Rank.Five, Rank.Six, Rank.Seven, Rank.Eight, Rank.Nine,
      Rank.Ten, Rank.Jack, Rank.Queen, Rank.King
    ];
    this.cards = [];
    for (let i = 0; i < numOfDecks; i++) {
      for (let s = 0; s < suits.length; s++) {
        for (let r = 0; r < ranks.length; r++) {
          const c = new Card(ranks[r], suits[s]);
          this.cards.push(Object.freeze(c));
        }
      }
    }
    for (let i = 0; i < numOfDecks * jokersPerDeck; i++) {
      const c = new Card(Rank.Joker, Suit.Joker);
      this.cards.push(Object.freeze(c));
    }
  }

  public getCard(): Card | undefined {
    return this.cards.pop();
  }

  public shuffle(): void {
    this.cards = shuffle(this.cards);
  }
};
