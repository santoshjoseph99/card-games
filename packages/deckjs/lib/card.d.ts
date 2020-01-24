import { Rank } from "./rank";
import { Suit } from "./suit";
export default class Card {
    rank: Rank;
    suit: Suit;
    blackjackValue: number;
    constructor(rank: Rank, suit: Suit);
    setBlackjackValue(v: number): void;
    static getBlackjackValue(rank: Rank): number;
    toLongString(): string;
    toShortString(): string;
    toString(): string;
}
//# sourceMappingURL=card.d.ts.map