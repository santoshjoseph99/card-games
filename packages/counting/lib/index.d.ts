import { Card, Rank, Suit } from 'deckjs';
export declare type CardCallback = (player: number, card: Card) => void;
export { Card, Rank, Suit };
export default class BlackjackCounter {
    private deck;
    private cb;
    private numOfDecks;
    private numOfPlayers;
    private countNum;
    constructor(cb: CardCallback, numOfDecks?: number, numOfPlayers?: number);
    readonly count: number;
    shuffle(): void;
    startGame(): void;
    endGame(): void;
    getCard(): Card;
    getCountFromCards(cards: Card[]): number;
    getBlackjackScore(cards: Card[]): number[];
    getHighestNonBustScore(scores: number[]): number;
    getLowestBustScore(scores: number[]): number;
    private getCount;
}
//# sourceMappingURL=index.d.ts.map