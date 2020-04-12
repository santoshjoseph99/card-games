const BlackjackGame = require('../../lib/blackjack-game').default;
const Player = require('../../lib/player').default;
const actions = require('../../lib/actions').default;
const {Card, Rank, Suit}= require('../../lib/blackjack-game');
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('chai-subset'));
chai.use(require('sinon-chai'));

describe('Blackjack Game', function() {
  describe('adding players', function() {
    it('invalid position number', function(){

    });
    it('player already at that position', function(){

    })
    it('player already exists on the table', function(){

    })
    it('adding multiple players', function(){

    })
  });
  describe('playing game with no players', function() {
    it('should not play', function() {
      const SUT = new BlackjackGame();
      const result = SUT.start();
      expect(result).to.be.false;
    });
  });
  describe('1 player', () => {
    context('player stands, dealer stands', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {};
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.hit)) {
            return {action: actions.hit}
          }
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Jack, Suit.Diamond),
          new Card(Rank.Jack, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
      });
      it('step5', () => {
        // console.log('DEALER:', SUT.dealer.cards);
        // console.log('PLAYER:', SUT.players[0].cards);
        SUT.step5();
      });
    });
    context('dealer blackjack, no insurance', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {};
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.hit)) {
            return {action: actions.hit}
          }
        } else if(data.action === actions.insurance) {
          return {amount: 0};
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Ace, Suit.Diamond),
          new Card(Rank.Jack, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond),
          new Card(Rank.Three, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
        expect(playerActionValues[3]).to.be.equal(actions.insurance);
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[11]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[12]).to.be.equal(actions.collectBet);
        expect(tableActionValues[13]).to.be.equal(actions.playerEndHand);

        expect(playerActionValues[4]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[5]).to.be.equal(actions.collectBet);
        expect(playerActionValues[6]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        // console.log('step6:', tableActionValues)
        expect(tableActionValues[14]).to.be.equal(actions.endHand);
      });
      it('step7', () => {

      });
     });
    context('dealer blackjack, yes insurance', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.hit)) {
            return {action: actions.hit}
          }
        } else if(data.action === actions.insurance) {
          return {amount: 10};
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Ace, Suit.Diamond),
          new Card(Rank.Jack, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond),
          new Card(Rank.Three, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
        expect(playerActionValues[3]).to.be.equal(actions.insurance);
      });
      it('step5', () => {
        // console.log(SUT.dealer.cards);
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[11]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[12]).to.be.equal(actions.collectBet);
        expect(tableActionValues[13]).to.be.equal(actions.insurancePayout);
        expect(tableActionValues[14]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[4]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[5]).to.be.equal(actions.collectBet);
        expect(playerActionValues[6]).to.be.equal(actions.insurancePayout);
        expect(playerActionValues[7]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        expect(tableActionValues[15]).to.be.equal(actions.endHand);
      });
      it('step7', () => {

      });
    });
    context('player blackjack, dealer no blackjack', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.hit)) {
            return {action: actions.hit}
          }
        } else if(data.action === actions.insurance) {
          return {amount: 10};
        } else if(data.action === actions.payOut) {
          p1.handEnded = true;
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Queen, Suit.Diamond),
          new Card(Rank.Ace, Suit.Diamond),
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[11]).to.be.equal(actions.payOut);
        expect(tableActionValues[12]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[3]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[4]).to.be.equal(actions.payOut);
        expect(playerActionValues[5]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        expect(tableActionValues[13]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[14]).to.be.equal(actions.endHand);
      });
      it('step7', () => {

      });
    });
    context('player and dealer blackjack (no insurance)', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.hit)) {
            return {action: actions.hit}
          }
        } else if(data.action === actions.insurance) {
          return {};
        } else if(data.action === actions.payOut) {
          p1.handEnded = true;
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Queen, Suit.Diamond),
          new Card(Rank.Ace, Suit.Diamond),
          new Card(Rank.Ace, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[11]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[12]).to.be.equal(actions.push);
        expect(tableActionValues[13]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[3]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[4]).to.be.equal(actions.push);
        expect(playerActionValues[5]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        expect(tableActionValues[14]).to.be.equal(actions.endHand);
      });
      it('step7', () => {

      });
    });
    context('player and dealer push', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(p1.cards.length === 2) {
            return {action: actions.hit}
          } else if (p1.cards.length === 3) {
            return {action: actions.stand};
          }
        } else if(data.action === actions.insurance) {
          return {};
        } else if(data.action === actions.payOut) {
          p1.handEnded = true;
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Three, Suit.Diamond),
          new Card(Rank.Three, Suit.Diamond),
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Seven, Suit.Diamond),
          new Card(Rank.Seven, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[11]).to.be.equal(actions.hit);
        expect(tableActionValues[12]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[13]).to.be.equal(actions.stand);
        expect(tableActionValues[14]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[3]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[4]).to.be.equal(actions.playHand);
        expect(playerActionValues[5]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[6]).to.be.equal(actions.playHand);
        expect(playerActionValues[7]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        
        expect(tableActionValues[15]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[16]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[17]).to.be.equal(actions.push);
        expect(tableActionValues[18]).to.be.equal(actions.endHand);
        
        expect(playerActionValues[8]).to.be.equal(actions.push);
      });
      it('step7', () => {

      });
    });
    context('player busts', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(p1.cards.length === 2) {
            return {action: actions.hit}
          } else if (p1.cards.length === 3) {
            return {action: actions.stand};
          }
        } else if(data.action === actions.insurance) {
          return {};
        } else if(data.action === actions.payOut) {
          p1.handEnded = true;
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Three, Suit.Diamond),
          new Card(Rank.Three, Suit.Diamond),
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Seven, Suit.Diamond),
          new Card(Rank.Seven, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[11]).to.be.equal(actions.hit);
        expect(tableActionValues[12]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[13]).to.be.equal(actions.stand);
        expect(tableActionValues[14]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[3]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[4]).to.be.equal(actions.playHand);
        expect(playerActionValues[5]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[6]).to.be.equal(actions.playHand);
        expect(playerActionValues[7]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        
        expect(tableActionValues[15]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[16]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[17]).to.be.equal(actions.push);
        expect(tableActionValues[18]).to.be.equal(actions.endHand);
        
        expect(playerActionValues[8]).to.be.equal(actions.push);
      });
      it('step7', () => {

      })
    });
    context('dealer busts', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(p1.cards.length === 2) {
            return {action: actions.hit}
          } else if (p1.cards.length === 3) {
            return {action: actions.stand};
          }
        } else if(data.action === actions.insurance) {
          return {};
        } else if(data.action === actions.payOut) {
          p1.handEnded = true;
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Three, Suit.Diamond), //d
          new Card(Rank.Three, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond), //d
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond), //d
          new Card(Rank.Seven, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[11]).to.be.equal(actions.hit);
        expect(tableActionValues[12]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[13]).to.be.equal(actions.stand);
        expect(tableActionValues[14]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[3]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[4]).to.be.equal(actions.playHand);
        expect(playerActionValues[5]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[6]).to.be.equal(actions.playHand);
        expect(playerActionValues[7]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        
        expect(tableActionValues[15]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[16]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[17]).to.be.equal(actions.payOut);
        expect(tableActionValues[18]).to.be.equal(actions.endHand);
        
        expect(playerActionValues[8]).to.be.equal(actions.payOut);
      });
      it('step7', () => {

      })
    });
  });
  describe('multiple players', () => {
    context.only('all players stand, dealer stands, and push', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: 'p1', money: 0});
      const p2 = new Player({name: 'p2', money: 0});
      const p3 = new Player({name: 'p3', money: 0});
      p1.sittingOut = false;
      p2.sittingOut = false;
      p3.sittingOut = false;
      function playerAction1(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {};
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.stand)) {
            return {action: actions.stand}
          }
        }
      }
      function playerAction2(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {};
        } else if(data.action === actions.playerCardUp) {
          p2.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.stand)) {
            return {action: actions.stand}
          }
        }
      }
      function playerAction3(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {};
        } else if(data.action === actions.playerCardUp) {
          p3.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.stand)) {
            return {action: actions.stand}
          }
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.addPlayer(p2, 2);
      SUT.addPlayer(p3, 3);
      SUT.subscribePlayerActions(p1, playerAction1)
      SUT.subscribePlayerActions(p2, playerAction2)
      SUT.subscribePlayerActions(p3, playerAction3)
      SUT.subscribeTableActions(tableActions);
      let ti = 0;
      let pi = 0;
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Jack, Suit.Diamond),
          new Card(Rank.Jack, Suit.Diamond),
          new Card(Rank.Ten, Suit.Spade),
          new Card(Rank.Ten, Suit.Spade),
          new Card(Rank.Ten, Suit.Club),
          new Card(Rank.Ten, Suit.Club),
          new Card(Rank.Ten, Suit.Heart),
          new Card(Rank.Ten, Suit.Heart),
        ]);
        expect(tableActionValues[ti++]).to.be.equal(actions.startGame)
        expect(tableActionValues[ti++]).to.be.equal(actions.shuffle)
        expect(tableActionValues[ti++]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[ti++]).to.be.equal(actions.burnCardUp)
        expect(tableActionValues).to.have.lengthOf(ti);

        expect(playerActionValues).to.be.lengthOf(pi);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[ti++]).to.be.equal(actions.playerBetAmount);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerBetAmount);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerBetAmount);
        expect(tableActionValues).to.have.lengthOf(ti);

        expect(playerActionValues[pi++]).to.be.equal(actions.startHand);
        expect(playerActionValues[pi++]).to.be.equal(actions.startHand);
        expect(playerActionValues[pi++]).to.be.equal(actions.startHand);
        expect(playerActionValues).to.be.lengthOf(pi);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[ti++]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[ti++]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[ti++]).to.be.equal(actions.exposeDealerCard);
        expect(tableActionValues).to.have.lengthOf(ti);

        expect(playerActionValues[pi++]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[pi++]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[pi++]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[pi++]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[pi++]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[pi++]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues).to.be.lengthOf(pi);
      });
      it('step4', () => {
        SUT.step4();
        expect(tableActionValues).to.have.lengthOf(ti);
        expect(playerActionValues).to.be.lengthOf(pi);
      });
      it('step5', () => {
        SUT.step5();
        expect(tableActionValues[ti++]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[ti++]).to.be.equal(actions.stand);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerEndHand);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[ti++]).to.be.equal(actions.stand);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerEndHand);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[ti++]).to.be.equal(actions.stand);
        expect(tableActionValues[ti++]).to.be.equal(actions.playerEndHand);
        expect(tableActionValues).to.have.lengthOf(ti);

        expect(playerActionValues[pi++]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[pi++]).to.be.equal(actions.playHand);
        expect(playerActionValues[pi++]).to.be.equal(actions.playerEndHand);
        expect(playerActionValues[pi++]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[pi++]).to.be.equal(actions.playHand);
        expect(playerActionValues[pi++]).to.be.equal(actions.playerEndHand);
        expect(playerActionValues[pi++]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[pi++]).to.be.equal(actions.playHand);
        expect(playerActionValues[pi++]).to.be.equal(actions.playerEndHand);
        expect(playerActionValues).to.be.lengthOf(pi);
      });
      it('step6', () => {
        SUT.step6();
        expect(tableActionValues[ti++]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[ti++]).to.be.equal(actions.push);
        expect(tableActionValues[ti++]).to.be.equal(actions.push);
        expect(tableActionValues[ti++]).to.be.equal(actions.push);
        expect(tableActionValues[ti++]).to.be.equal(actions.endHand);
        expect(tableActionValues).to.have.lengthOf(ti);

        expect(playerActionValues[pi++]).to.be.equal(actions.push);
        expect(playerActionValues[pi++]).to.be.equal(actions.push);
        expect(playerActionValues[pi++]).to.be.equal(actions.push);
        expect(playerActionValues).to.be.lengthOf(pi);
      });
    });
    xcontext('dealer blackjack, no players insurance', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {};
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.hit)) {
            return {action: actions.hit}
          }
        } else if(data.action === actions.insurance) {
          return {amount: 0};
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Ace, Suit.Diamond),
          new Card(Rank.Jack, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond),
          new Card(Rank.Three, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
        expect(playerActionValues[3]).to.be.equal(actions.insurance);
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[11]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[12]).to.be.equal(actions.collectBet);
        expect(tableActionValues[13]).to.be.equal(actions.playerEndHand);

        expect(playerActionValues[4]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[5]).to.be.equal(actions.collectBet);
        expect(playerActionValues[6]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        // console.log('step6:', tableActionValues)
        expect(tableActionValues[14]).to.be.equal(actions.endHand);
      });
      it('step7', () => {

      });
     });
    xcontext('dealer blackjack, all players insurance', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.hit)) {
            return {action: actions.hit}
          }
        } else if(data.action === actions.insurance) {
          return {amount: 10};
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Ace, Suit.Diamond),
          new Card(Rank.Jack, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond),
          new Card(Rank.Three, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
        expect(playerActionValues[3]).to.be.equal(actions.insurance);
      });
      it('step5', () => {
        // console.log(SUT.dealer.cards);
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[11]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[12]).to.be.equal(actions.collectBet);
        expect(tableActionValues[13]).to.be.equal(actions.insurancePayout);
        expect(tableActionValues[14]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[4]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[5]).to.be.equal(actions.collectBet);
        expect(playerActionValues[6]).to.be.equal(actions.insurancePayout);
        expect(playerActionValues[7]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        expect(tableActionValues[15]).to.be.equal(actions.endHand);
      });
      it('step7', () => {

      });
    });
    xcontext('all players blackjack, dealer no blackjack', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.hit)) {
            return {action: actions.hit}
          }
        } else if(data.action === actions.insurance) {
          return {amount: 10};
        } else if(data.action === actions.payOut) {
          p1.handEnded = true;
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Queen, Suit.Diamond),
          new Card(Rank.Ace, Suit.Diamond),
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[11]).to.be.equal(actions.payOut);
        expect(tableActionValues[12]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[3]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[4]).to.be.equal(actions.payOut);
        expect(playerActionValues[5]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        expect(tableActionValues[13]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[14]).to.be.equal(actions.endHand);
      });
      it('step7', () => {

      });
    });
    xcontext('player and dealer blackjack (no insurance)', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(data.availableActions.find(x => x === actions.hit)) {
            return {action: actions.hit}
          }
        } else if(data.action === actions.insurance) {
          return {};
        } else if(data.action === actions.payOut) {
          p1.handEnded = true;
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Queen, Suit.Diamond),
          new Card(Rank.Ace, Suit.Diamond),
          new Card(Rank.Ace, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[11]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[12]).to.be.equal(actions.push);
        expect(tableActionValues[13]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[3]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[4]).to.be.equal(actions.push);
        expect(playerActionValues[5]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        expect(tableActionValues[14]).to.be.equal(actions.endHand);
      });
      it('step7', () => {

      });
    });
    xcontext('all players and dealer stand, players win', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(p1.cards.length === 2) {
            return {action: actions.hit}
          } else if (p1.cards.length === 3) {
            return {action: actions.stand};
          }
        } else if(data.action === actions.insurance) {
          return {};
        } else if(data.action === actions.payOut) {
          p1.handEnded = true;
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Three, Suit.Diamond),
          new Card(Rank.Three, Suit.Diamond),
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Seven, Suit.Diamond),
          new Card(Rank.Seven, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[11]).to.be.equal(actions.hit);
        expect(tableActionValues[12]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[13]).to.be.equal(actions.stand);
        expect(tableActionValues[14]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[3]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[4]).to.be.equal(actions.playHand);
        expect(playerActionValues[5]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[6]).to.be.equal(actions.playHand);
        expect(playerActionValues[7]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        
        expect(tableActionValues[15]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[16]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[17]).to.be.equal(actions.push);
        expect(tableActionValues[18]).to.be.equal(actions.endHand);
        
        expect(playerActionValues[8]).to.be.equal(actions.push);
      });
      it('step7', () => {

      });
    });
    xcontext('all players busts', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(p1.cards.length === 2) {
            return {action: actions.hit}
          } else if (p1.cards.length === 3) {
            return {action: actions.stand};
          }
        } else if(data.action === actions.insurance) {
          return {};
        } else if(data.action === actions.payOut) {
          p1.handEnded = true;
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Three, Suit.Diamond),
          new Card(Rank.Three, Suit.Diamond),
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Seven, Suit.Diamond),
          new Card(Rank.Seven, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[11]).to.be.equal(actions.hit);
        expect(tableActionValues[12]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[13]).to.be.equal(actions.stand);
        expect(tableActionValues[14]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[3]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[4]).to.be.equal(actions.playHand);
        expect(playerActionValues[5]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[6]).to.be.equal(actions.playHand);
        expect(playerActionValues[7]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        
        expect(tableActionValues[15]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[16]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[17]).to.be.equal(actions.push);
        expect(tableActionValues[18]).to.be.equal(actions.endHand);
        
        expect(playerActionValues[8]).to.be.equal(actions.push);
      });
      it('step7', () => {

      })
    });
    xcontext('players take card, dealer busts', () => {
      const playerActionValues = [];
      const tableActionValues = [];
      const SUT = new BlackjackGame();
      const p1 = new Player({name: '', money: 0});
      p1.sittingOut = false;
      function playerAction(data) {
        playerActionValues.push(data.action);
        if(data.action === actions.startHand) {
          return {
            amount: data.minBet
          };
        } else if(data.action === actions.playerCardUp) {
          p1.cards.push(data.card);
        } else if(data.action === actions.playHand) {
          if(p1.cards.length === 2) {
            return {action: actions.hit}
          } else if (p1.cards.length === 3) {
            return {action: actions.stand};
          }
        } else if(data.action === actions.insurance) {
          return {};
        } else if(data.action === actions.payOut) {
          p1.handEnded = true;
        }
      }
      function tableActions(data) {
        tableActionValues.push(data.action);
      }
      SUT.addPlayer(p1, 1);
      SUT.subscribePlayerActions(p1, playerAction)
      SUT.subscribeTableActions(tableActions)
      it('step1', function () {
        SUT.step1();
        SUT.setCards([
          new Card(Rank.Three, Suit.Diamond), //d
          new Card(Rank.Three, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond), //d
          new Card(Rank.Eight, Suit.Diamond),
          new Card(Rank.Ten, Suit.Diamond), //d
          new Card(Rank.Seven, Suit.Diamond),
        ]);
        expect(tableActionValues[0]).to.be.equal(actions.startGame)
        expect(tableActionValues[1]).to.be.equal(actions.shuffle)
        expect(tableActionValues[2]).to.be.equal(actions.setEndCard)
        expect(tableActionValues[3]).to.be.equal(actions.burnCardUp)
        expect(playerActionValues).to.be.lengthOf(0);
      });
      it('step2', function () {
        SUT.step2();
        expect(tableActionValues[4]).to.be.equal(actions.playerBetAmount);
        expect(playerActionValues[0]).to.be.equal(actions.startHand);
      });
      it('step3', () => {
        SUT.step3();
        expect(tableActionValues[5]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[6]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[7]).to.be.equal(actions.dealerCardDown);
        expect(tableActionValues[8]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[9]).to.be.equal(actions.exposeDealerCard);

        expect(playerActionValues[1]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[2]).to.be.equal(actions.playerCardUp);
      });
      it('step4', () => {
        SUT.step4();
      });
      it('step5', () => {
        SUT.step5();

        expect(tableActionValues[10]).to.be.equal(actions.playerStartHand);
        expect(tableActionValues[11]).to.be.equal(actions.hit);
        expect(tableActionValues[12]).to.be.equal(actions.playerCardUp);
        expect(tableActionValues[13]).to.be.equal(actions.stand);
        expect(tableActionValues[14]).to.be.equal(actions.playerEndHand);
        
        expect(playerActionValues[3]).to.be.equal(actions.playerStartHand);
        expect(playerActionValues[4]).to.be.equal(actions.playHand);
        expect(playerActionValues[5]).to.be.equal(actions.playerCardUp);
        expect(playerActionValues[6]).to.be.equal(actions.playHand);
        expect(playerActionValues[7]).to.be.equal(actions.playerEndHand);
      });
      it('step6', () => {
        SUT.step6();
        
        expect(tableActionValues[15]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[16]).to.be.equal(actions.dealerCardUp);
        expect(tableActionValues[17]).to.be.equal(actions.payOut);
        expect(tableActionValues[18]).to.be.equal(actions.endHand);
        
        expect(playerActionValues[8]).to.be.equal(actions.payOut);
      });
      it('step7', () => {

      })
    });
  });
});