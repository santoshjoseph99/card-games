import { Card, Rank, Suit } from 'deckjs';
export declare type CardCallback = (player: number, card: Card) => void;
export { Card, Rank, Suit };
export default class BlackjackCounter {
    private deck;
    private numOfDecks;
    private numOfPlayers;
    private countNum;
    constructor(numOfDecks?: number, numOfPlayers?: number);
    get count(): number;
    shuffle(): void;
    startGame(): void;
    startHand(cb: CardCallback): Promise<void>;
    endGame(): void;
    getCard(): Promise<Card>;
    getCountFromCards(cards: Card[]): number;
    getBlackjackScore(cards: Card[]): number[];
    isSoftSeventeen(cards: Card[]): boolean;
    getHighestNonBustScore(scores: number[]): number;
    getLowestBustScore(scores: number[]): number;
    getCount(card: Card): number;
}
//# sourceMappingURL=counting.d.ts.map