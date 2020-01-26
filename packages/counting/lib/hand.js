"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
const uniq_1 = __importDefault(require("lodash/uniq"));
const sortBy_1 = __importDefault(require("lodash/sortBy"));
const deckjs_1 = require("deckjs");
class Hand {
    static isSoft(cards) {
        return cards.length === 2 && Hand.hasAce(cards);
    }
    static isHard(cards) {
        return cards.length === 2 && !Hand.hasAce(cards);
    }
    static hasAce(cards) {
        return cards.some(Hand.isAceValue);
    }
    static isAceValue(card) {
        return card.blackjackValue === 0;
    }
    static hasBlackjack(values) {
        return values.some(x => x === 21);
    }
    static isCardTen(card) {
        return card.rank === deckjs_1.Rank.Ten ||
            card.rank === deckjs_1.Rank.Jack ||
            card.rank === deckjs_1.Rank.Queen ||
            card.rank === deckjs_1.Rank.King;
    }
    static isNatural(cards) {
        if (cards.length > 2) {
            return false;
        }
        return (cards[0].rank === deckjs_1.Rank.Ace && Hand.isCardTen(cards[1])) ||
            (cards[1].rank === deckjs_1.Rank.Ace && Hand.isCardTen(cards[0]));
    }
    static checkHandBust(values) {
        return values.filter(x => x <= 21).length === values.length;
    }
    static getHands(cards) {
        const results = [];
        Hand.getHandsHelper(cards, results);
        if (results.length === 0) {
            results.push(cards);
        }
        return results;
    }
    static getHandsHelper(cards, results, start = 0) {
        for (let i = start; i < cards.length; i++) {
            if (Hand.isAceValue(cards[i])) {
                const cardsLow = cloneDeep_1.default(cards);
                cardsLow[i].setBlackjackValue(1);
                const cardsHigh = cloneDeep_1.default(cards);
                cardsHigh[i].setBlackjackValue(11);
                if (!cardsLow.find(c => c.blackjackValue === 0)) {
                    results.push(cardsLow);
                }
                else {
                    Hand.getHandsHelper(cardsLow, results, i + 1);
                }
                if (!cardsHigh.find(c => c.blackjackValue === 0)) {
                    results.push(cardsHigh);
                }
                else {
                    Hand.getHandsHelper(cardsHigh, results, i + 1);
                }
            }
        }
    }
    static getHandValue(cards) {
        return cards.reduce((acc, card) => acc + card.blackjackValue, 0);
    }
    static getHandValues(cards) {
        const handsList = Hand.getHands(cards);
        const handValues = handsList.map(list => Hand.getHandValue(list));
        return sortBy_1.default(uniq_1.default(handValues));
    }
}
exports.default = Hand;
//# sourceMappingURL=hand.js.map