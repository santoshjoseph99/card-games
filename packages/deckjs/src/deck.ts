import shuffle from 'lodash/shuffle';
import Card from './card';
import { Rank } from './rank';
import { Suit } from './suit';
import cloneDeep from 'lodash/cloneDeep';

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
          this.cards.push(c);
        }
      }
    }
    for (let i = 0; i < numOfDecks * jokersPerDeck; i++) {
      const c = new Card(Rank.Joker, Suit.Joker);
      this.cards.push(c);
    }
  }

  public getCard(): Card | undefined {
    return this.cards.pop();
  }

  public peek() : Card {
    return this.cards[this.cards.length - 1];
  }

  public shuffle(): void {
    this.cards = shuffle(this.cards);
  }

  public swapCardAt(rank:Rank, suit:Suit, index:number) {
    if(index >= this.cards.length) {
      throw new Error('out of range');
    }
    const foundIndex = this.cards.findIndex(x => x.rank === rank && x.suit === suit);
    if(foundIndex === -1) {
      throw new Error('Could not find card');
    }
    const swapCard = cloneDeep(this.cards[index]);
    const foundCard = cloneDeep(this.cards[foundIndex]);
    this.cards[index] = foundCard;
    this.cards[foundIndex] = swapCard;
  }

  public setCards(list:Card[]) {
    let length = this.cards.length - 1;
    for(const c of list) {
      this.swapCardAt(c.rank, c.suit, length);
      length -= 1;
    }
  }
};
