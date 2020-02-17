import Card from './card';
import { Rank } from './rank';
import { Suit } from './suit';
export default class Deck {
    private cards;
    constructor(numOfDecks?: number, jokersPerDeck?: number);
    init(numOfDecks: number, jokersPerDeck: number): void;
    getCard(): Card | undefined;
    peek(): Card;
    shuffle(): void;
    swapCardAt(rank: Rank, suit: Suit, index: number): void;
    setCards(list: Card[]): void;
}
//# sourceMappingURL=deck.d.ts.map