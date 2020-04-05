import { Card } from 'deckjs';
export default interface IDeckStrategy {
    getNumOfDecks(): number;
    shuffleDeck(): void;
    setEndIdx(i: number): void;
    getCard(): Card | undefined;
    setCards(cards: Card[]): void;
}
//# sourceMappingURL=ideck-strategy.d.ts.map