import { Rank } from "./rank";
import { Suit } from "./suit";
export default class Card {
    rank: Rank;
    suit: Suit;
    constructor(rank: Rank, suit: Suit);
    toLongString(): string;
    toShortString(): string;
    toString(): string;
}
//# sourceMappingURL=card.d.ts.map