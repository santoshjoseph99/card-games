import {Card, Deck} from 'deckjs';

export default interface IDeckStrategy {
  getNumOfDecks () : number;
  shuffleDeck () : void;
  setEndIdx (i:number) : void;
  // deal () : boolean;
  getCard () : Card|undefined;
  setCards(cards:Card[]): void;
}
