"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deckjs_1 = require("deckjs");
exports.Card = deckjs_1.Card;
exports.Rank = deckjs_1.Rank;
exports.Suit = deckjs_1.Suit;
const actions_1 = require("./actions");
const rxjs_1 = require("rxjs");
const actions_2 = require("./actions");
const bets_strategy_1 = require("./bets-strategy");
const dealer_1 = require("./dealer");
const dealer_strategy_1 = require("./dealer-strategy");
const doubledown_strategy_1 = require("./doubledown-strategy");
const hand_1 = require("./hand");
const insurance_strategy_1 = require("./insurance-strategy");
const payout_strategy_1 = require("./payout-strategy");
const sixdeck_strategy_1 = require("./sixdeck-strategy");
const split_strategy_1 = require("./split-strategy");
const table_strategy_1 = require("./table-strategy");
const defaults = require('lodash/defaults');
class AllStrategies {
    constructor() {
        this.insurance = new insurance_strategy_1.default();
        this.doubleDown = new doubledown_strategy_1.default();
        this.dealer = new dealer_strategy_1.default();
        this.payout = new payout_strategy_1.default();
        this.deck = new sixdeck_strategy_1.default();
        this.bet = new bets_strategy_1.default();
        this.split = new split_strategy_1.default();
        this.table = new table_strategy_1.default();
        //TODO: logging strategy
        //TODO: telemetry
    }
}
class BlackjackGame {
    constructor(strategies) {
        this.strategies = new AllStrategies();
        defaults(strategies, this.strategies);
        this.readyToShuffle = false;
        this.dealer = new dealer_1.default();
        this.tableActions = new rxjs_1.Subject();
        this.playerAction = new rxjs_1.Subject();
        this.players = [];
        this.maxPlayers = this.strategies.table.maxPlayers();
    }
    setCards(cards) {
        this.strategies.deck.setCards(cards);
    }
    start() {
        if (this.getValidPlayers().length === 0) {
            return false;
        }
        this.step1();
        this.step2();
        while (!this.readyToShuffle) {
            this.step3();
            this.step4();
            this.step5();
            this.step6();
        }
        this.step7();
        return true;
    }
    getValidPlayers() {
        // TODO: check money
        return this.players.filter(x => !x.sittingOut);
    }
    addPlayer(player, position) {
        if (position > this.maxPlayers || position < 0) {
            return new Error(`position must be 1 and ${this.maxPlayers}`);
        }
        if (this.players[position]) {
            return new Error('position not available');
        }
        const p = this.players.find(x => player === x);
        if (p) {
            return new Error('player already is at the table');
        }
        this.players[position - 1] = player;
    }
    subscribeTableActions(cb) {
        return this.tableActions.subscribe(cb);
    }
    subscribePlayerActions(player, cb) {
        const p = this.players.find(x => player === x);
        if (!p || !cb || typeof cb !== 'function') {
            return new Error('invalid player or invalid callback');
        }
        p.cb = cb;
        return this.playerAction.subscribe(cb);
    }
    getAvailableActions(player) {
        const results = [];
        const { cards, money, bet } = player.getInfo();
        const handValues = hand_1.default.getHandValues(cards);
        if (hand_1.default.hasBlackjack(handValues)) {
            results.push(actions_2.default.blackjack);
        }
        else {
            if (!hand_1.default.isHandBusted(handValues)) {
                results.push(actions_2.default.hit);
                results.push(actions_2.default.stand);
                if (this.strategies.split.valid(cards)) {
                    if (money >= bet) {
                        results.push(actions_2.default.split);
                    }
                }
                if (this.strategies.doubleDown.valid(cards)) {
                    if (money > 0) {
                        results.push(actions_2.default.doubleDown);
                    }
                }
            }
            else {
                results.push(actions_2.default.bust);
            }
        }
        return results;
    }
    dealerUpdate(action) {
    }
    // step 1: shuffle deck, burn card
    step1() {
        this.tableActions.next({ action: actions_1.default.startGame });
        this.strategies.deck.shuffleDeck();
        this.tableActions.next({ action: actions_1.default.shuffle });
        this.strategies.deck.setEndIdx(this.strategies.table.getEndDeckIndex());
        this.tableActions.next({ action: actions_1.default.setEndCard });
        //TODO: burn card optional?
        this.tableActions.next({
            action: actions_1.default.burnCardUp,
            card: this.strategies.deck.getCard()
        });
    }
    // step 2: get player bets
    step2() {
        this.dealerUpdate(actions_1.default.startHand);
        this.getValidPlayers().forEach(p => {
            const result = p.cb && p.cb({
                action: actions_1.default.startHand,
                maxBet: this.strategies.bet.getMax(),
                minBet: this.strategies.bet.getMin(),
            });
            if (!result) {
                p.sittingOut = true;
                return;
            }
            p.bet = result.amount || 0;
            this.tableActions.next({ action: actions_1.default.playerBetAmount, amount: result.amount, player: p });
        });
    }
    // step 3: deal all cards
    step3() {
        this.dealOneCardForAll();
        this.dealOneCardForAll();
        this.tableActions.next({
            action: actions_1.default.exposeDealerCard,
            card: this.dealer.cards[0]
        });
    }
    // step 4: check insurance
    step4() {
        if (this.strategies.insurance.valid(this.dealer.cards[0], this.dealer.cards[1])) {
            this.getValidPlayers().forEach(p => {
                var _a;
                const amount = this.strategies.insurance.amount(p.bet);
                const result = p.cb && p.cb({ action: actions_1.default.insurance, amount });
                if ((_a = result) === null || _a === void 0 ? void 0 : _a.amount) {
                    p.insuranceBet = result.amount;
                }
            });
        }
    }
    // step 5: play hand 
    //  1. check dealer blackjack
    //  2. player blackjacks
    //  3. player hands
    step5() {
        // console.log('step5a`:', this.dealer.cards);
        if (hand_1.default.isNatural(this.dealer.cards)) {
            this.tableActions.next({ action: actions_1.default.dealerCardUp, card: this.dealer.cards[1] });
            this.getValidPlayers().forEach(p => {
                p.cb && p.cb({ action: actions_1.default.playerStartHand });
                this.tableActions.next({ action: actions_1.default.playerStartHand, player: p });
                if (p.insuranceBet) {
                    this.tableActions.next({ action: actions_1.default.collectBet, player: p });
                    p.cb && p.cb({ action: actions_1.default.collectBet });
                    this.tableActions.next({ action: actions_1.default.insurancePayout, player: p });
                    p.cb && p.cb({
                        action: actions_1.default.insurancePayout,
                        amount: this.strategies.insurance.payout(p.insuranceBet),
                    });
                }
                else if (!hand_1.default.isNatural(p.getInfo().cards)) {
                    this.tableActions.next({ action: actions_1.default.collectBet, player: p });
                    p.cb && p.cb({ action: actions_1.default.collectBet });
                }
                else {
                    this.tableActions.next({ action: actions_1.default.push, player: p });
                    p.cb && p.cb({ action: actions_1.default.push });
                }
                p.cb && p.cb({ action: actions_1.default.playerEndHand });
                this.tableActions.next({ action: actions_1.default.playerEndHand, player: p });
            });
        }
        else {
            this.getValidPlayers().forEach(p => {
                var _a;
                p.cb && p.cb({ action: actions_1.default.playerStartHand });
                this.tableActions.next({ action: actions_1.default.playerStartHand, player: p });
                let play = true;
                if (hand_1.default.isNatural(p.cards)) {
                    p.cb && p.cb({
                        action: actions_1.default.payOut,
                        amount: this.strategies.payout.getPayout(p.bet, true)
                    });
                    this.tableActions.next({ action: actions_1.default.payOut, player: p });
                    play = false;
                }
                while (play) {
                    // console.log('actions:', this.getAvailableActions(p));
                    const result = p.cb && p.cb({
                        action: actions_1.default.playHand,
                        availableActions: this.getAvailableActions(p)
                    });
                    switch ((_a = result) === null || _a === void 0 ? void 0 : _a.action) {
                        case actions_1.default.stand:
                            this.tableActions.next({ action: actions_1.default.stand, player: p });
                            play = false;
                            break;
                        case actions_1.default.hit:
                            this.tableActions.next({ action: actions_1.default.hit, player: p });
                            this.getCard(p);
                            const values1 = hand_1.default.getHandValues(p.cards);
                            if (hand_1.default.isHandBusted(values1)) {
                                p.cb && p.cb({ action: actions_1.default.bust });
                                this.tableActions.next({ action: actions_1.default.bust, player: p });
                                play = false;
                            }
                            break;
                        case actions_1.default.doubleDown:
                            this.tableActions.next({ action: actions_1.default.doubleDown, player: p });
                            const card = this.getCard(p);
                            p.cb && p.cb({ action: actions_1.default.playerCardUp, card });
                            this.tableActions.next({ action: actions_1.default.playerCardUp, card, player: p });
                            const values2 = hand_1.default.getHandValues(p.cards);
                            if (hand_1.default.isHandBusted(values2)) {
                                p.cb && p.cb({ action: actions_1.default.bust });
                                this.tableActions.next({ action: actions_1.default.bust, player: p });
                            }
                            play = false;
                            break;
                        case actions_1.default.split:
                            // TODO
                            // this.tableActions.next({ action: Actions.SPLIT, player: p });
                            break;
                    }
                }
                p.cb && p.cb({ action: actions_1.default.playerEndHand });
                this.tableActions.next({ action: actions_1.default.playerEndHand, player: p });
            });
        }
    }
    // step 6: 
    //  1. dealer hand (if any players)
    //  2. payouts
    //  3. end hand
    step6() {
        if (hand_1.default.isNatural(this.dealer.cards)) {
            this.tableActions.next({ action: actions_1.default.endHand });
            return;
        }
        const players = this.getPlayersForSettlement();
        this.tableActions.next({ action: actions_1.default.dealerCardUp, card: this.dealer.cards[1] });
        if (players.length === 0) {
            this.tableActions.next({ action: actions_1.default.endHand });
            return;
        }
        while (this.shouldDealerGetAnotherCard()) {
            this.getDealerCard();
        }
        const dealerValues = hand_1.default.getHandValues(this.dealer.cards);
        const dealerScore = hand_1.default.isHandBusted(dealerValues) ?
            0 : hand_1.default.getHighestNonBustScore(dealerValues);
        players.forEach(p => {
            const playerScore = this.getScore(p.cards);
            if (playerScore > dealerScore) {
                const payOut = this.strategies.payout.getPayout(p.bet, false);
                p.cb && p.cb({
                    action: actions_1.default.payOut,
                    amount: payOut
                });
                this.tableActions.next({ action: actions_1.default.payOut, player: p, amount: payOut });
            }
            else if (playerScore < dealerScore) {
                p.cb && p.cb({ action: actions_1.default.collectBet });
                this.tableActions.next({ action: actions_1.default.collectBet, player: p });
            }
            else {
                p.cb && p.cb({ action: actions_1.default.push });
                this.tableActions.next({ action: actions_1.default.push, player: p });
            }
        });
        this.tableActions.next({ action: actions_1.default.endHand });
    }
    // step 7: end game?
    step7() {
        this.tableActions.next({ action: actions_1.default.endGame });
    }
    getPlayersForSettlement() {
        return this.getValidPlayers().filter(p => !p.handEnded);
    }
    getDealerCard() {
        const dealerCard = this.strategies.deck.getCard();
        if (dealerCard) {
            this.dealer.action(actions_1.default.dealerCardUp, dealerCard);
            this.tableActions.next({ action: actions_1.default.dealerCardUp, card: dealerCard });
        }
        else {
            // TODO:
        }
    }
    shouldDealerGetAnotherCard() {
        const values = hand_1.default.getHandValues(this.dealer.cards);
        if (hand_1.default.isHandBusted(values)) {
            return false;
        }
        const score = hand_1.default.getHighestNonBustScore(values);
        return score < 17;
    }
    getCard(p) {
        let card = this.strategies.deck.getCard();
        if (!card) {
            this.tableActions.next({ action: actions_1.default.lastHand });
            card = this.strategies.deck.getCard();
            this.readyToShuffle = true;
        }
        p.cb && p.cb({ action: actions_1.default.playerCardUp, card });
        this.tableActions.next({ action: actions_1.default.playerCardUp, card, player: p });
        if (!card) {
            return new deckjs_1.Card(deckjs_1.Rank.Joker, deckjs_1.Suit.Joker);
        }
        return card;
    }
    dealOneCardForAll() {
        const dealerCard = this.strategies.deck.getCard();
        this.tableActions.next({ action: actions_1.default.dealerCardDown, card: dealerCard });
        this.dealer.action(actions_1.default.dealerCardDown, dealerCard || new deckjs_1.Card(deckjs_1.Rank.Joker, deckjs_1.Suit.Joker));
        this.getValidPlayers().forEach(p => {
            let card = this.strategies.deck.getCard();
            if (!card) {
                this.tableActions.next({ action: actions_1.default.lastHand });
                card = this.strategies.deck.getCard();
                this.readyToShuffle = true;
            }
            p.cb && p.cb({ action: actions_1.default.playerCardUp, card });
            this.tableActions.next({ action: actions_1.default.playerCardUp, card, player: p });
        });
    }
    getScore(cards) {
        const values = hand_1.default.getHandValues(cards);
        return hand_1.default.isHandBusted(values) ?
            hand_1.default.getLowestBustScore(values) :
            hand_1.default.getHighestNonBustScore(values);
    }
}
exports.default = BlackjackGame;
//# sourceMappingURL=blackjack-game.js.map