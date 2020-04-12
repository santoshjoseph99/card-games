import { Card } from 'deckjs';
import IDoubleDownStrategy from './interfaces/idoubledown-strategy';
import ISplitStrategy from './interfaces/isplit-strategy';
export default class Hand {
    static canSplitHand(cards: Card[], strategy: ISplitStrategy): boolean;
    static canDoubleDown(cards: Card[], strategy: IDoubleDownStrategy): boolean;
    static isSoft(cards: Card[]): boolean;
    static isSoftSeventeen(cards: Card[]): boolean;
    static isHard(cards: Card[]): boolean;
    static hasAce(cards: Card[]): boolean;
    static isAce(card: Card): boolean;
    static isAceValue(card: Card): boolean;
    static hasBlackjack(values: number[]): boolean;
    static isCardTen(card: Card): boolean;
    static isNatural(cards: Card[]): boolean;
    static isHandBusted(values: number[]): boolean;
    static getHands(cards: Card[]): Card[][];
    static getHandsHelper(cards: Card[], results: Card[][], start?: number): void;
    static getHandValue(cards: Card[]): number;
    static getHandValues(cards: Card[]): number[];
    static getHighestNonBustScore(scores: number[]): number;
    static getLowestBustScore(scores: number[]): number;
}
//# sourceMappingURL=hand.d.ts.map