import { Card } from "deckjs";

export default interface IDealerStrategy {
  dealCardsUp () : boolean;
  takeHit(currentCards: Card[], newCard: Card) : boolean;
}
