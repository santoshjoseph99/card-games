import Card from './card';
export default class Deck {
    private cards;
    constructor(numOfDecks?: number, jokersPerDeck?: number);
    init(numOfDecks: number, jokersPerDeck: number): void;
    getCard(): Card | undefined;
    shuffle(): void;
}
//# sourceMappingURL=deck.d.ts.map