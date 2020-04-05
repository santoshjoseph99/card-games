"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hand_1 = require("./hand");
class DealerStrategy {
    dealCardsUp() {
        return true;
    }
    takeHit(cards, newCard) {
        const allCards = cards.concat(newCard);
        const values = hand_1.default.getHandValues(allCards);
        const score = hand_1.default.getHighestNonBustScore(values);
        return score < 17;
    }
}
exports.default = DealerStrategy;
//# sourceMappingURL=dealer-strategy.js.map