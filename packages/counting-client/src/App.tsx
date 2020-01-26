import React from 'react';
import './App.css';
import Dealer from './components/Dealer';
import Player from './components/Player';
import BlackjackCounter, { Card } from 'blackjack-counting';
import Count from './components/Count';

interface IAppState {
  cards: Card[][],
  scores: number[],
  disableHit: boolean[],
}

class App extends React.Component<{}, IAppState> {
  private blackjackCounter:BlackjackCounter;
  private cards:Card[][];
  private scores:number[];
  private disableHit: boolean[];

  constructor(props:any) {
    super(props);
    this.blackjackCounter = new BlackjackCounter(this.cardCallback.bind(this));
    this.cards = [];
    this.scores = [];
    this.cards[0] = [];
    this.cards[1] = [];
    this.disableHit = [];
    this.state = {
      cards: this.cards,
      scores: [],
      disableHit: [false, false]
    }
  }

  /**
   * called by blackjackCounter to deal a card
   * @param player 
   * @param card 
   */
  cardCallback(player: number, card: Card) {
    console.log(player, card);
    this.cards[player].push(card);
    const scores = this.blackjackCounter.getBlackjackScore(this.cards[player]);
    this.scores[player] = this.blackjackCounter.getHighestNonBustScore(scores);
    this.setState({
      cards: this.cards,
      scores: this.scores,
    });
  }

  /**
   * called by the player/dealer component to handle the hit/stand action
   * @param player 
   * @param hit 
   */
  actionCallback(player: number, hit:boolean) {
    if(player === 0) {
      
    }
    // called when a player makes an action
    if(hit) {
      const card = this.blackjackCounter.getCard();
      this.cards[player].push(card);
      const scores = this.blackjackCounter.getBlackjackScore(this.cards[player]);
      console.log('SCORE:', scores);
      const score = this.blackjackCounter.getHighestNonBustScore(scores);
      if(score) {
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

    }
  }

  newGame() {
    this.blackjackCounter.shuffle();
    this.blackjackCounter.startGame();
  }

  componentDidMount() {
    this.newGame();
  }

  render() {
    return (
      <div>
        <Player 
          name={'me'}
          score={this.state.scores[1]}
          cards={this.state.cards[1]}
          actionCb={this.actionCallback.bind(this)}
          disableHit={this.state.disableHit[1]} />
        <Dealer
          cards={this.state.cards[0]}
          actionCb={this.actionCallback.bind(this)}
          disableHit={false} />
        <Count count={this.blackjackCounter.count} />
      </div>
    );
  }
}

export default App;
