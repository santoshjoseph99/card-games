"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = __importDefault(require("./card"));
const shuffle_1 = __importDefault(require("lodash/shuffle"));
class Deck {
    constructor(numOfDecks = 1, jokersPerDeck = 0) {
        this.cards = [];
        this.init(numOfDecks, jokersPerDeck);
    }
    init(numOfDecks, jokersPerDeck) {
        const suits = ['c', 'd', 'h', 's'];
        const ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
        this.cards = [];
        for (let i = 0; i < numOfDecks; i++) {
            for (let s = 0; s < suits.length; s++) {
                for (let r = 0; r < ranks.length; r++) {
                    const c = new card_1.default(ranks[r], suits[s]);
                    this.cards.push(Object.freeze(c));
                }
            }
        }
        for (let i = 0; i < numOfDecks * jokersPerDeck; i++) {
            const c = new card_1.default('j', 'j');
            this.cards.push(Object.freeze(c));
        }
    }
    getCard() {
        return this.cards.pop();
    }
    shuffle() {
        this.cards = shuffle_1.default(this.cards);
    }
}
exports.default = Deck;
;
//# sourceMappingURL=deck.js.map