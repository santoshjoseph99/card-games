"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = __importDefault(require("./card"));
const deck_1 = __importDefault(require("./deck"));
exports.ShuffleCard = new card_1.default('0', '0');
class BlackjackDeck extends deck_1.default {
    constructor(numOfDecks, shufflePoint = 0) {
        super(numOfDecks);
        this.shufflePoint = 0;
        this.index = 0;
        this.shufflePointReached = false;
        this.shufflePoint = shufflePoint ? shufflePoint : (numOfDecks * 52) - (numOfDecks * 10);
        this.index = 0;
        this.shufflePointReached = false;
    }
    shuffle() {
        super.shuffle();
        this.index = 0;
        this.shufflePointReached = false;
    }
    getCard() {
        if (this.shufflePoint === this.index && !this.shufflePointReached) {
            this.shufflePointReached = true;
            return exports.ShuffleCard;
        }
        this.index += 1;
        let c = super.getCard();
        if (!c) {
            this.shuffle(); // this is wrong
            c = super.getCard();
            if (!c) {
                c = new card_1.default('1', '1'); // never gets here
            }
        }
        return c;
    }
}
exports.default = BlackjackDeck;
//# sourceMappingURL=blackjack-deck.js.map