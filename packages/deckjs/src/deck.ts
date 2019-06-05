import Card from './card';
import shuffle from 'lodash/shuffle';

export default class Deck {
  private cards:Card[];
  constructor(numOfDecks:number=1, jokersPerDeck:number=0) {
    this.cards = [];
    this.init(numOfDecks, jokersPerDeck);
  }

  public init(numOfDecks:number, jokersPerDeck:number):void {
    const suits = ['c', 'd', 'h', 's'];
    const ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
    this.cards = [];
    for(let i = 0; i < numOfDecks; i++) {
      for(let s = 0; s < suits.length; s++) {
        for(let r = 0; r < ranks.length; r++) {
          const c = new Card(ranks[r], suits[s]);
          this.cards.push(Object.freeze(c));
        }
      }
    }
    for(let i = 0; i < numOfDecks*jokersPerDeck; i++){
      const c = new Card('j', 'j');
      this.cards.push(Object.freeze(c));
    }
  }

  public getCard() : Card|undefined {
    return this.cards.pop();
  }

  public shuffle() : void {
    this.cards = shuffle(this.cards);
  }
};
