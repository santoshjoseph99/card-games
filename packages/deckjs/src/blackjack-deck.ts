import Card from './card';
import Deck from './deck';

export const ShuffleCard = new Card('0', '0');

export default class BlackjackDeck extends Deck {
  private shufflePoint:number = 0;
  private index:number = 0;
  private shufflePointReached:boolean = false;

  constructor(numOfDecks:number, shufflePoint:number = 0) {
    super(numOfDecks);
    this.shufflePoint = shufflePoint ? shufflePoint : (numOfDecks * 52) - (numOfDecks * 10);
  }

  public shuffle() {
    super.shuffle();
    this.index = 0;
    this.shufflePointReached = false;
  }

  public getCard(): Card {
    if(this.shufflePoint === this.index && !this.shufflePointReached) {
      this.shufflePointReached = true;
      return ShuffleCard;
    }
    this.index += 1;
    let c = super.getCard();
    if(!c) {
      this.shuffle(); // TODO: this is wrong
      c = super.getCard();
      if(!c) {
        c = new Card('1','1'); // never gets here
      }
    }
    return c;
  }
}