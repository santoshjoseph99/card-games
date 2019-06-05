"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var card_1 = __importDefault(require("./card"));
var shuffle_1 = __importDefault(require("lodash/shuffle"));
var Deck = /** @class */ (function () {
    function Deck(numOfDecks, jokersPerDeck) {
        if (!numOfDecks) {
            numOfDecks = 1;
        }
        if (!jokersPerDeck) {
            jokersPerDeck = 0;
        }
        this.cards = [];
        this.init(numOfDecks, jokersPerDeck);
    }
    Deck.prototype.init = function (numOfDecks, jokersPerDeck) {
        var suits = ['c', 'd', 'h', 's'];
        var ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
        this.cards = [];
        for (var i = 0; i < numOfDecks; i++) {
            for (var s = 0; s < suits.length; s++) {
                for (var r = 0; r < ranks.length; r++) {
                    var c = new card_1.default(ranks[r], suits[s]);
                    this.cards.push(Object.freeze(c));
                }
            }
        }
        for (var i = 0; i < numOfDecks * jokersPerDeck; i++) {
            var c = new card_1.default('j', 'j');
            this.cards.push(Object.freeze(c));
        }
    };
    Deck.prototype.getCard = function () {
        return this.cards.pop();
    };
    Deck.prototype.shuffle = function () {
        this.cards = shuffle_1.default(this.cards);
    };
    return Deck;
}());
exports.default = Deck;
;
//# sourceMappingURL=deck.js.map