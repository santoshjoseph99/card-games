"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shuffle_1 = __importDefault(require("lodash/shuffle"));
const card_1 = __importDefault(require("./card"));
const rank_1 = require("./rank");
const suit_1 = require("./suit");
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
class Deck {
    constructor(numOfDecks = 1, jokersPerDeck = 0) {
        this.cards = [];
        this.init(numOfDecks, jokersPerDeck);
    }
    init(numOfDecks, jokersPerDeck) {
        const suits = [suit_1.Suit.Club, suit_1.Suit.Diamond, suit_1.Suit.Heart, suit_1.Suit.Spade];
        const ranks = [
            rank_1.Rank.Ace, rank_1.Rank.Two, rank_1.Rank.Three, rank_1.Rank.Four,
            rank_1.Rank.Five, rank_1.Rank.Six, rank_1.Rank.Seven, rank_1.Rank.Eight, rank_1.Rank.Nine,
            rank_1.Rank.Ten, rank_1.Rank.Jack, rank_1.Rank.Queen, rank_1.Rank.King
        ];
        this.cards = [];
        for (let i = 0; i < numOfDecks; i++) {
            for (let s = 0; s < suits.length; s++) {
                for (let r = 0; r < ranks.length; r++) {
                    const c = new card_1.default(ranks[r], suits[s]);
                    this.cards.push(c);
                }
            }
        }
        for (let i = 0; i < numOfDecks * jokersPerDeck; i++) {
            const c = new card_1.default(rank_1.Rank.Joker, suit_1.Suit.Joker);
            this.cards.push(c);
        }
    }
    getCard() {
        return this.cards.pop();
    }
    peek() {
        return this.cards[this.cards.length - 1];
    }
    shuffle() {
        this.cards = shuffle_1.default(this.cards);
    }
    swapCardAt(rank, suit, index) {
        if (index >= this.cards.length) {
            throw new Error('out of range');
        }
        const foundIndex = this.cards.findIndex(x => x.rank === rank && x.suit === suit);
        if (foundIndex === -1) {
            throw new Error('Could not find card');
        }
        const swapCard = cloneDeep_1.default(this.cards[index]);
        const foundCard = cloneDeep_1.default(this.cards[foundIndex]);
        this.cards[index] = foundCard;
        this.cards[foundIndex] = swapCard;
    }
    setCards(list) {
        let length = this.cards.length - 1;
        for (const c of list) {
            this.swapCardAt(c.rank, c.suit, length);
            length -= 1;
        }
    }
}
exports.default = Deck;
;
//# sourceMappingURL=deck.js.map