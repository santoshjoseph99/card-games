"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deckjs_1 = require("deckjs");
exports.Card = deckjs_1.Card;
exports.Rank = deckjs_1.Rank;
exports.Suit = deckjs_1.Suit;
const hand_1 = __importDefault(require("./hand"));
const lodash_1 = require("lodash");
const wait = (ms) => new Promise((r, j) => setTimeout(r, ms));
class BlackjackCounter {
    constructor(numOfDecks = 6, numOfPlayers = 1) {
        // TODO: strategyType
        this.numOfDecks = numOfDecks;
        this.numOfPlayers = numOfPlayers;
        this.deck = new deckjs_1.BlackjackDeck(numOfDecks);
        this.countNum = 0;
    }
    get count() {
        return this.countNum;
    }
    shuffle() {
        this.deck.shuffle();
    }
    startGame() {
        this.countNum = 0;
    }
    startHand(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const d1 = this.deck.getCard();
            const d2 = this.deck.getCard();
            const p1 = this.deck.getCard();
            const p2 = this.deck.getCard();
            cb(1, p1);
            yield wait(200);
            this.countNum += this.getCount(p1);
            cb(0, d1);
            yield wait(200);
            this.countNum += this.getCount(d1);
            cb(1, p2);
            yield wait(200);
            this.countNum += this.getCount(p2);
            cb(0, d2);
            yield wait(200);
            this.countNum += this.getCount(d2);
        });
    }
    endGame() {
    }
    getCard() {
        return __awaiter(this, void 0, void 0, function* () {
            const c = this.deck.getCard();
            this.countNum += this.getCount(c);
            yield wait(200);
            return c;
        });
    }
    getCountFromCards(cards) {
        return cards.map(this.getCount).reduce((a, b) => a + b, 0);
    }
    getBlackjackScore(cards) {
        const results = hand_1.default.getHandValues(cards);
        return results;
    }
    isSoftSeventeen(cards) {
        return cards[0].rank === deckjs_1.Rank.Ace && cards[1].rank === deckjs_1.Rank.Six ||
            cards[1].rank === deckjs_1.Rank.Ace && cards[0].rank === deckjs_1.Rank.Six;
    }
    getHighestNonBustScore(scores) {
        return lodash_1.max(scores.filter(x => x < 22)) || 0;
    }
    getLowestBustScore(scores) {
        return lodash_1.min(scores.filter(x => x > 21)) || 0;
    }
    getCount(card) {
        if (card.rank === deckjs_1.Rank.Ace ||
            card.rank === deckjs_1.Rank.Ten ||
            card.rank === deckjs_1.Rank.Jack ||
            card.rank === deckjs_1.Rank.Queen ||
            card.rank === deckjs_1.Rank.King) {
            return -1;
        }
        else if (card.rank === deckjs_1.Rank.Two ||
            card.rank === deckjs_1.Rank.Three ||
            card.rank === deckjs_1.Rank.Four ||
            card.rank === deckjs_1.Rank.Five ||
            card.rank === deckjs_1.Rank.Six ||
            card.rank === deckjs_1.Rank.Seven) {
            return 1;
        }
        else {
            return 0;
        }
    }
}
exports.default = BlackjackCounter;
/*
 UI code will call create the class with the number of decks, strategyForCounting, players#, timeout, showcount
   then will call start() with call backs
   callback -> player#, cards
   getCard() will return a card (when player hits)
   +, - for keeping count or -2, -1, 0, +1, +2 for buttons and have a highlight over each card
   OR
   +, - buttons and then prompt the player for action and then +/-. then dealer happens every 1 second


*/ 
//# sourceMappingURL=counting.js.map