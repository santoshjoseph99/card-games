import IDealerStrategy from './interfaces/idealer-strategy';
import { Card } from 'deckjs';
export default class DealerStrategy implements IDealerStrategy {
    dealCardsUp(): boolean;
    takeHit(cards: Card[], newCard: Card): boolean;
}
//# sourceMappingURL=dealer-strategy.d.ts.map