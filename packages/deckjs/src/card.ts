import { Rank, ShortRank } from "./rank";
import { Suit, ShortSuit } from "./suit";

export default class Card {
  blackjackValue: number;
  constructor(public rank:Rank, public suit:Suit) {
    this.blackjackValue = Card.getBlackjackValue(rank);
  }

  setBlackjackValue(v:number) {
    this.blackjackValue = v;
  }

  static getBlackjackValue(rank:Rank): number {
    switch(rank) {
      case Rank.Ace: return 0; // TODO: this should return {1,11} or [1,11]
      case Rank.Two: return 2;
      case Rank.Three: return 3;
      case Rank.Four: return 4;
      case Rank.Five: return 5;
      case Rank.Six: return 6;
      case Rank.Seven: return 7;
      case Rank.Eight: return 8;
      case Rank.Nine: return 9;
      case Rank.Ten:
      case Rank.Jack:
      case Rank.Queen:
      case Rank.King:
        return 10;
      default:
        return -1;
    }
  }

  toLongString() {
    return `${this.rank} of ${this.suit}s`;
  }

  toShortString() {
    return `${ShortRank[this.rank]}${ShortSuit[this.suit]}`
  }

  toString() {
    return this.toLongString();
  }
};
