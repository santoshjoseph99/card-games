"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rank_1 = require("./rank");
const suit_1 = require("./suit");
class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
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