"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rank_1 = require("./rank");
const suit_1 = require("./suit");
class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.blackjackValue = Card.getBlackjackValue(rank);
    }
    setBlackjackValue(v) {
        this.blackjackValue = v;
    }
    static getBlackjackValue(rank) {
        switch (rank) {
            case rank_1.Rank.Ace: return 1;
            case rank_1.Rank.Two: return 2;
            case rank_1.Rank.Three: return 3;
            case rank_1.Rank.Four: return 4;
            case rank_1.Rank.Five: return 5;
            case rank_1.Rank.Six: return 6;
            case rank_1.Rank.Seven: return 7;
            case rank_1.Rank.Eight: return 8;
            case rank_1.Rank.Nine: return 9;
            case rank_1.Rank.Ten:
            case rank_1.Rank.Jack:
            case rank_1.Rank.Queen:
            case rank_1.Rank.King:
                return 10;
            default:
                return 0;
        }
    }
    toLongString() {
        return `${this.rank} of ${this.suit}s`;
    }
    toShortString() {
        return `${rank_1.ShortRank[this.rank]}${suit_1.ShortSuit[this.suit]}`;
    }
    toString() {
        return this.toLongString();
    }
}
exports.default = Card;
;
//# sourceMappingURL=card.js.map