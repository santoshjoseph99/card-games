import IDealerStrategy from './interfaces/idealer-strategy';
import { Card } from 'deckjs';
import Hand from './hand';

export default class DealerStrategy implements IDealerStrategy {
  public dealCardsUp () : boolean {
    return true
  }
  public takeHit (cards:Card[], newCard:Card) : boolean {
    const allCards = cards.concat(newCard);
    const values = Hand.getHandValues(allCards);
    const score = Hand.getHighestNonBustScore(values);
    return score < 17;
  }
}
