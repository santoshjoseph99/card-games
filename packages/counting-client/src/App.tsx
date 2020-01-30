import React from 'react';
import './App.css';
import Dealer from './components/Dealer';
import Player from './components/Player';
import {BlackjackCounter, Card, Hand} from 'blackjack-counting';
import Count from './components/Count';

/*
1. pick counting system (veryify counting is working)
2. blackjack play. 
      split hands
      double down
      surrender
      insurance
      change stand button to "something else" when player busts or natural
3. more attractive visuals (ms fabric)
4. user login (save scores)
5. automatic next hand option
6. side count systems support
7. deck options (number, card visual types)
8. deploy website
9. refactor into better components (lerna.js for package management).
    rename App.tsx into something else and move it into components directory
    better state management (classes instead of cards, Player, Dealer)
*/

interface IAppState {
  cards: Card[][],
  scores: number[],
  disableHit: boolean[],
  handEnded: boolean,
}

class App extends React.Component<{}, IAppState> {
  private blackjackCounter: BlackjackCounter;
  private cards: Card[][];
  private scores: number[];
  private disableHit: boolean[];
  private handEnded: boolean;

  constructor(props: any) {
    super(props);
    this.handEnded = false;
    this.blackjackCounter = new BlackjackCounter(this.cardCallback.bind(this));
    this.cards = [];
    this.scores = [];
    this.cards[0] = [];
    this.cards[1] = [];
    this.disableHit = [];
    this.state = {
      cards: this.cards,
      scores: [],
      disableHit: [false, false],
      handEnded: this.handEnded,
    }
  }

  /**
   * called by blackjackCounter to deal a card
   * @param player 
   * @param card 
   */
  cardCallback(player: number, card: Card) {
    this.cards[player].push(card);
    const scores = this.blackjackCounter.getBlackjackScore(this.cards[player]);
    this.scores[player] = this.blackjackCounter.getHighestNonBustScore(scores);
    if(this.cards[1].length === 2 && Hand.isNatural(this.cards[1])) {
      this.disableHit[1] = true;
    }
    if(this.cards[0].length === 2 && Hand.isNatural(this.cards[0])) {
      this.disableHit[1] = true;
      this.handEnded = true;
    }
    if(player === 0 && this.cards[0].length === 2) {
      card.faceUp = false;
    }
    this.setState({
      cards: this.cards,
      scores: this.scores,
      disableHit: this.disableHit,
      handEnded: this.handEnded,
    });
  }

  /**
   * called by the player/dealer component to handle the hit/stand action
   * @param player 
   * @param hit 
   */
  actionCallback(player: number, hit: boolean) {
    if (hit) {
      const card = this.blackjackCounter.getCard();
      this.cards[player].push(card);
      const scores = this.blackjackCounter.getBlackjackScore(this.cards[player]);
      const score = this.blackjackCounter.getHighestNonBustScore(scores);
      if (score) {
        this.scores[player] = score;
      } else {
        this.scores[player] = this.blackjackCounter.getLowestBustScore(scores);
        this.disableHit[player] = true;
      }
      this.setState({
        cards: this.cards,
        scores: this.scores,
        disableHit: this.disableHit,
      });
    } else {
      this.disableHit[player] = true;
      this.cards[0][1].faceUp = true;
      this.setState({
        disableHit: this.disableHit,
        cards: this.cards,
      });
      if(this.scores[1] > 21 || Hand.isNatural(this.cards[1])) {
        this.setState({
          handEnded: true
        });
        return;
      }
      let scores = this.blackjackCounter.getBlackjackScore(this.cards[0]);
      let score = this.blackjackCounter.getHighestNonBustScore(scores);
      if (score) {
        while (score < 17) {
          const card = this.blackjackCounter.getCard();
          this.cards[0].push(card);
          scores = this.blackjackCounter.getBlackjackScore(this.cards[0]);
          score = this.blackjackCounter.getHighestNonBustScore(scores);
          this.scores[0] = score === 0 ?
            this.blackjackCounter.getLowestBustScore(scores) : score;
          setTimeout(() => {
            this.setState({
              cards: this.cards,
              scores: this.scores,
            });
          }, 500);
          if(score === 0){
            break;
          }
        }
      } else {
        //bust
      }
      this.setState({
        handEnded: true
      });
    }
  }

  newGame() {
    this.blackjackCounter.shuffle();
    this.blackjackCounter.startGame();
  }

  componentDidMount() {
    this.newGame();
  }

  newHand = () => {
    this.handEnded = false;
    this.cards = [];
    this.scores = [];
    this.cards[0] = [];
    this.cards[1] = [];
    this.disableHit = [false, false];
    this.setState({
      cards: this.cards,
      scores: this.scores,
      disableHit: this.disableHit,
      handEnded: false,
    });
    this.blackjackCounter.startHand();
  }

  getWinner() {
    const dealerScores = this.blackjackCounter.getBlackjackScore(this.cards[0]);
    const dealerScore = this.blackjackCounter.getHighestNonBustScore(dealerScores);
    const playerScores = this.blackjackCounter.getBlackjackScore(this.cards[1]);
    const playerScore = this.blackjackCounter.getHighestNonBustScore(playerScores);
    if(playerScore === 0) {
      return 'Dealer wins, Player busts';
    }
    if(dealerScore === 0) {
      return 'Player wins, Dealer busts';
    }
    if(playerScore === dealerScore) {
      return 'Push!';
    } else if (playerScore > dealerScore) {
      return 'Player Wins';
    } else if (playerScore < dealerScore) {
      return 'Dealer Wins';
    }
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={this.newHand}>New Hand</button>
        </div>
        <Player
          name={'me'}
          score={this.state.scores[1]}
          cards={this.state.cards[1]}
          actionCb={this.actionCallback.bind(this)}
          disableHit={this.state.disableHit[1]} />
        <Dealer
          cards={this.state.cards[0]} 
          score={this.state.scores[0]} />
        <Count count={this.blackjackCounter.count} />
        <div>{this.state.handEnded && <span>Result: {this.getWinner()}</span>}</div>
      </div>
    );
  }
}

export default App;
