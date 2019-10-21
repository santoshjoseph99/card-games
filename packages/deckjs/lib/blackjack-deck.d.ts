import Card from './card';
import Deck from './deck';
export declare const ShuffleCard: Card;
export default class BlackjackDeck extends Deck {
    private shufflePoint;
    private index;
    private shufflePointReached;
    constructor(numOfDecks: number, shufflePoint?: number);
    shuffle(): void;
    getCard(): Card;
}
//# sourceMappingURL=blackjack-deck.d.ts.map