import { Card } from 'deckjs';
export default class Hand {
    static isSoft(cards: Card[]): boolean;
    static isHard(cards: Card[]): boolean;
    static hasAce(cards: Card[]): boolean;
    static isAceValue(card: Card): boolean;
    static hasBlackjack(values: number[]): boolean;
    static isCardTen(card: Card): boolean;
    static isNatural(cards: Card[]): boolean;
    static checkHandBust(values: number[]): boolean;
    static getHands(cards: Card[]): Card[][];
    static getHandsHelper(cards: Card[], results: Card[][], start?: number): void;
    static getHandValue(cards: Card[]): number;
    static getHandValues(cards: Card[]): number[];
}
//# sourceMappingURL=hand.d.ts.map