import { Rank, ShortRank } from "./rank";
import { Suit, ShortSuit } from "./suit";

export default class Card {
  constructor(public rank:Rank, public suit:Suit) {
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
