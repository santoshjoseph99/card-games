import { Card } from 'deckjs';
import Actions from './actions';
import IDealer from './interfaces/idealer';
export default class Dealer implements IDealer {
    cards: Card[];
    action(action: Actions, data: Card): void;
}
//# sourceMappingURL=dealer.d.ts.map