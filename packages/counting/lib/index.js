"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deckjs_1 = require("deckjs");
exports.Card = deckjs_1.Card;
exports.Rank = deckjs_1.Rank;
exports.Suit = deckjs_1.Suit;
class BlackjackCounter {
    constructor(cb, numOfDecks = 6, numOfPlayers = 1) {
        // TODO: strategyType
        this.numOfDecks = numOfDecks;
        this.numOfPlayers = numOfPlayers;
        this.cb = cb;
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
        const d1 = this.deck.getCard();
        const d2 = this.deck.getCard();
        const p1 = this.deck.getCard();
        const p2 = this.deck.getCard();
        this.cb(1, p1);
        this.countNum += this.getCount(p1);
        this.cb(0, d1);
        this.countNum += this.getCount(d1);
        this.cb(1, p2);
        this.countNum += this.getCount(p2);
        this.cb(0, d2);
        this.countNum += this.getCount(d2);
    }
    endGame() {
    }
    getCard() {
        const c = this.deck.getCard();
        this.countNum += this.getCount(c);
        return c;
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
            card.rank === deckjs_1.Rank.Six) {
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
//# sourceMappingURL=index.js.map