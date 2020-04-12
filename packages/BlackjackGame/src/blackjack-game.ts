import { Card, Rank, Suit } from "deckjs";
import Actions from './actions';
import { PlayerActionCb, TableActionCb } from './interfaces/callbacks';
import IDealer from "./interfaces/idealer";
import { Subject, Subscription } from 'rxjs'
import actions from './actions'
import BetsStrategy from './bets-strategy'
import Dealer from './dealer'
import DealerStrategy from './dealer-strategy'
import DoubleDownStrategy from './doubledown-strategy'
import Hand from './hand'
import InsuranceStrategy from './insurance-strategy'
import PayoutStrategy from './payout-strategy'
import SixDeckStrategy from './sixdeck-strategy'
import SplitStrategy from './split-strategy'
import TableStrategy from './table-strategy'
import ITableAction from "./interfaces/itableaction";
import IPlayerAction from "./interfaces/iplayeraction";
import Player from "./player";
const defaults = require('lodash/defaults');
export { Card, Rank, Suit };

interface IAllStrategies {
  insurance: InsuranceStrategy
  doubleDown: DoubleDownStrategy
  dealer: DealerStrategy
  payout: PayoutStrategy
  deck: SixDeckStrategy
  bet: BetsStrategy
  split: SplitStrategy
  table: TableStrategy
}

class AllStrategies implements IAllStrategies {
  insurance: InsuranceStrategy;
  doubleDown: DoubleDownStrategy;
  dealer: DealerStrategy;
  payout: PayoutStrategy;
  deck: SixDeckStrategy;
  bet: BetsStrategy;
  split: SplitStrategy;
  table: TableStrategy;

  constructor() {
    this.insurance = new InsuranceStrategy()
    this.doubleDown = new DoubleDownStrategy()
    this.dealer = new DealerStrategy()
    this.payout = new PayoutStrategy()
    this.deck = new SixDeckStrategy()
    this.bet = new BetsStrategy()
    this.split = new SplitStrategy()
    this.table = new TableStrategy()
    //TODO: logging strategy
    //TODO: telemetry
  }
}

export default class BlackjackGame {
  private players: Player[];
  private readyToShuffle: boolean;
  private maxPlayers: number;
  private dealer: IDealer;
  private tableActions: Subject<ITableAction>;
  private playerAction: Subject<IPlayerAction>;
  private strategies: IAllStrategies

  constructor(strategies: IAllStrategies) {
    this.strategies = new AllStrategies();
    defaults(strategies, this.strategies)
    this.readyToShuffle = false
    this.dealer = new Dealer()
    this.tableActions = new Subject()
    this.playerAction = new Subject()
    this.players = []
    this.maxPlayers = this.strategies.table.maxPlayers()
  }

  public setCards(cards:Card[]): void {
    this.strategies.deck.setCards(cards);
  }

  public start(): boolean {
    if (this.getValidPlayers().length === 0) {
      return false
    }
    this.step1()
    this.step2()
    while (!this.readyToShuffle) {
      this.step3()
      this.step4()
      this.step5()
      this.step6()
    }
    this.step7()
    return true
  }

  public getValidPlayers(): Player[] {
    // TODO: check money
    return this.players.filter(x => !x.sittingOut);
  }

  public addPlayer(player: Player, position: number): void | Error {
    if (position > this.maxPlayers || position < 0) {
      return new Error(`position must be 1 and ${this.maxPlayers}`)
    }
    if (this.players[position]) {
      return new Error('position not available')
    }
    const p = this.players.find(x => player === x)
    if (p) {
      return new Error('player already is at the table')
    }
    this.players[position - 1] = player
  }

  public subscribeTableActions(cb: TableActionCb): Subscription {
    return this.tableActions.subscribe(cb)
  }

  public subscribePlayerActions(player: Player, cb: PlayerActionCb): Subscription | Error {
    const p = this.players.find(x => player === x)
    if (!p || !cb || typeof cb !== 'function') {
      return new Error('invalid player or invalid callback')
    }
    p.cb = cb
    return this.playerAction.subscribe(cb)
  }

  public getAvailableActions(player: Player): Actions[] {
    const results = []
    const { cards, money, bet } = player.getInfo()
    const handValues = Hand.getHandValues(cards);

    if (Hand.hasBlackjack(handValues)) {
      results.push(actions.blackjack);
    } else {
      if (!Hand.isHandBusted(handValues)) {
        results.push(actions.hit)
        results.push(actions.stand)
        if (this.strategies.split.valid(cards)) {
          if (money >= bet) {
            results.push(actions.split)
          }
        }
        if (this.strategies.doubleDown.valid(cards)) {
          if (money > 0) {
            results.push(actions.doubleDown);
          }
        }
      } else {
        results.push(actions.bust);
      }
    }
    return results;
  }
  private dealerUpdate(action:Actions){
  }
  // step 1: shuffle deck, burn card
  private step1() {
    this.tableActions.next({ action: Actions.startGame })
    this.strategies.deck.shuffleDeck()
    this.tableActions.next({ action: Actions.shuffle })
    this.strategies.deck.setEndIdx(this.strategies.table.getEndDeckIndex())
    this.tableActions.next({ action: Actions.setEndCard })
    //TODO: burn card optional?
    this.tableActions.next({
      action: Actions.burnCardUp,
      card: this.strategies.deck.getCard()
    })
  }
  // step 2: get player bets
  private step2() {
    this.dealerUpdate(Actions.startHand)
    this.getValidPlayers().forEach(p => {
      const result = p.cb && p.cb({
        action: Actions.startHand,
        maxBet: this.strategies.bet.getMax(),
        minBet: this.strategies.bet.getMin(),
      })
      if (!result) {
        p.sittingOut = true
        return
      }
      p.bet = result.amount || 0;
      this.tableActions.next({ action: Actions.playerBetAmount, amount: result.amount, player: p })
    })
  }
  // step 3: deal all cards
  private step3() {
    this.dealOneCardForAll()
    this.dealOneCardForAll()
    this.tableActions.next({
      action: Actions.exposeDealerCard,
      card: this.dealer.cards[0]
    })
  }
  // step 4: check insurance
  private step4() {
    if (this.strategies.insurance.valid(this.dealer.cards[0], this.dealer.cards[1])) {
      this.getValidPlayers().forEach(p => {
        const amount = this.strategies.insurance.amount(p.bet)
        const result = p.cb && p.cb({ action: Actions.insurance, amount })
        if (result?.amount) {
          p.insuranceBet = result.amount
        }
      });
    }
  }
  // step 5: play hand 
  //  1. check dealer blackjack
  //  2. player blackjacks
  //  3. player hands
  private step5() {
    // console.log('step5a`:', this.dealer.cards);
    if (Hand.isNatural(this.dealer.cards)) {
      this.tableActions.next({ action: Actions.dealerCardUp, card: this.dealer.cards[1]})
      this.getValidPlayers().forEach(p => {
        p.cb && p.cb({action: Actions.playerStartHand});
        this.tableActions.next({ action: Actions.playerStartHand, player: p })
        if (p.insuranceBet) {
          this.tableActions.next({ action: Actions.collectBet, player: p })
          p.cb && p.cb({ action: Actions.collectBet })
          this.tableActions.next({ action: Actions.insurancePayout, player: p })
          p.cb && p.cb({
            action: Actions.insurancePayout,
            amount: this.strategies.insurance.payout(p.insuranceBet),
          })
        } else if (!Hand.isNatural(p.getInfo().cards)) {
          this.tableActions.next({ action: Actions.collectBet, player: p })
          p.cb && p.cb({ action: Actions.collectBet })
        } else {
          this.tableActions.next({ action: Actions.push, player: p })
          p.cb && p.cb({ action: Actions.push })
        }
        p.cb && p.cb({action: Actions.playerEndHand});
        this.tableActions.next({ action: Actions.playerEndHand, player: p })
      })
    } else {
      this.getValidPlayers().forEach(p => {
        p.cb && p.cb({action: Actions.playerStartHand});
        this.tableActions.next({ action: Actions.playerStartHand, player: p })
        let play = true;
        if(Hand.isNatural(p.cards)) {
          p.cb && p.cb({
            action: Actions.payOut,
            amount: this.strategies.payout.getPayout(p.bet, true)
          });
          this.tableActions.next({action: Actions.payOut, player: p});
          play = false;
        }
        while (play) {
          // console.log('actions:', this.getAvailableActions(p));
          const result = p.cb && p.cb({ 
            action: Actions.playHand,
            availableActions: this.getAvailableActions(p) 
          });
          switch (result?.action) {
            case Actions.stand:
              this.tableActions.next({ action: Actions.stand, player: p });
              play = false;
              break
            case Actions.hit:
              this.tableActions.next({ action: Actions.hit, player: p })
              this.getCard(p)
              const values1 = Hand.getHandValues(p.cards)
              if (Hand.isHandBusted(values1)) {
                p.cb && p.cb({ action: Actions.bust })
                this.tableActions.next({ action: Actions.bust, player: p })
                play = false;
              }
              break
            case Actions.doubleDown:
              this.tableActions.next({ action: Actions.doubleDown, player: p })
              const card = this.getCard(p)
              p.cb && p.cb({ action: Actions.playerCardUp, card })
              this.tableActions.next({ action: Actions.playerCardUp, card, player: p })
              const values2 = Hand.getHandValues(p.cards)
              if (Hand.isHandBusted(values2)) {
                p.cb && p.cb({ action: Actions.bust })
                this.tableActions.next({ action: Actions.bust, player: p })
              }
              play = false;
              break
            case Actions.split:
              // TODO
              // this.tableActions.next({ action: Actions.SPLIT, player: p });
              break
          }
        }
        p.cb && p.cb({action: Actions.playerEndHand});
        this.tableActions.next({ action: Actions.playerEndHand, player: p })
      })
    }
  }
  // step 6: 
  //  1. dealer hand (if any players)
  //  2. payouts
  //  3. end hand
  private step6() {
    if (Hand.isNatural(this.dealer.cards)) {
      this.tableActions.next({ action: Actions.endHand })
      return;
    }
    const players = this.getPlayersForSettlement();
    this.tableActions.next({ action: Actions.dealerCardUp, card: this.dealer.cards[1]})
    if(players.length === 0) {
      this.tableActions.next({ action: Actions.endHand })
      return;
    }
    while(this.shouldDealerGetAnotherCard()) {
      this.getDealerCard();
    }
    const dealerValues = Hand.getHandValues(this.dealer.cards);
    const dealerScore = Hand.isHandBusted(dealerValues) ?
      0 : Hand.getHighestNonBustScore(dealerValues);
    players.forEach(p => {
      const playerScore = this.getScore(p.cards);
      if(playerScore > dealerScore) {
        const payOut = this.strategies.payout.getPayout(p.bet, false);
        p.cb && p.cb({
          action: Actions.payOut,
          amount: payOut
        });
        this.tableActions.next({ action: Actions.payOut, player: p, amount: payOut })
      } else if (playerScore < dealerScore) {
        p.cb && p.cb({action: Actions.collectBet});
        this.tableActions.next({ action: Actions.collectBet, player: p })
      } else {
        p.cb && p.cb({action: Actions.push});
        this.tableActions.next({ action: Actions.push, player: p })
      }
    });
    this.tableActions.next({ action: Actions.endHand })
  }
  // step 7: end game?
  private step7() {
    this.tableActions.next({ action: Actions.endGame })
  }
  private getPlayersForSettlement() {
    return this.getValidPlayers().filter(p => !p.handEnded);
  }
  private getDealerCard() {
    const dealerCard = this.strategies.deck.getCard();
    if(dealerCard) {
      this.dealer.action(Actions.dealerCardUp, dealerCard);
      this.tableActions.next({ action: Actions.dealerCardUp, card: dealerCard })
    } else {
      // TODO:
    }
  }
  private shouldDealerGetAnotherCard(): boolean {
    const values = Hand.getHandValues(this.dealer.cards);
    if(Hand.isHandBusted(values)) {
      return false;
    }
    const score = Hand.getHighestNonBustScore(values);
    return score < 17;
  }
  private getCard(p: Player): Card {
    let card = this.strategies.deck.getCard()
    if (!card) {
      this.tableActions.next({ action: Actions.lastHand })
      card = this.strategies.deck.getCard()
      this.readyToShuffle = true
    }
    p.cb && p.cb({ action: Actions.playerCardUp, card })
    this.tableActions.next({ action: Actions.playerCardUp, card, player: p })
    if(!card) {
      return new Card(Rank.Joker, Suit.Joker);
    }
    return card;
  }
  private dealOneCardForAll() {
    const dealerCard = this.strategies.deck.getCard()
    this.tableActions.next({ action: Actions.dealerCardDown, card: dealerCard })
    this.dealer.action(Actions.dealerCardDown, dealerCard|| new Card(Rank.Joker, Suit.Joker))
    this.getValidPlayers().forEach(p => {
      let card = this.strategies.deck.getCard()
      if (!card) {
        this.tableActions.next({ action: Actions.lastHand })
        card = this.strategies.deck.getCard()
        this.readyToShuffle = true
      }
      p.cb && p.cb({ action: Actions.playerCardUp, card })
      this.tableActions.next({ action: Actions.playerCardUp, card, player: p })
    })
  }
  private getScore(cards:Card[]): number {
    const values = Hand.getHandValues(cards);
    return Hand.isHandBusted(values) ?
      Hand.getLowestBustScore(values) :
      Hand.getHighestNonBustScore(values);
  }
}
