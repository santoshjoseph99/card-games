import React from 'react';
import './App.css';
import Dealer from './components/Dealer';
import Player from './components/Player';
import BlackjackCounter, { Card } from 'blackjack-counting';

interface IAppState {
  cards: Card[][],
  scores: number[],
  disableHit: boolean[],
}

class App extends React.Component<{}, IAppState> {
  private blackjackCounter:BlackjackCounter;
  private cards:Card[][];
  private scores:number[];

  constructor(props:any) {
    super(props);
    this.blackjackCounter = new BlackjackCounter(this.cardCallback.bind(this));
    this.cards = [];
    this.scores = [];
    this.cards[0] = [];
    this.cards[1] = [];
    this.state = {
      cards: this.cards,
      scores: [],
      disableHit: [false, false]
    }
  }

  cardCallback(player: number, card: Card) {
    // called by blackjackCounter to deal cards
    console.log(player, card);
    this.cards[player].push(card);
    const scores = this.blackjackCounter.getBlackjackScore(this.cards[player]);
    this.scores[player] = this.blackjackCounter.getHighestNonBustScore(scores);
    this.setState({
      cards: this.cards,
      scores: this.scores,
    });
  }

  actionCallback(player: number, hit:boolean) {
    if(player === 0) {
      
    }
    // called when a player makes an action
    if(hit) {
      const card = this.blackjackCounter.getCard();
      this.cards[player].push(card);
      const scores = this.blackjackCounter.getBlackjackScore(this.cards[player]);
      console.log('SCORE:', scores);
      this.scores[player] = this.blackjackCounter.getHighestNonBustScore(scores);
      this.setState({
        cards: this.cards,
        scores: this.scores
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
    // console.log('RENDER1:', this.state.cards[0])
    // console.log('RENDER2:', this.state.cards[1])
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
        <div>{this.blackjackCounter.count}</div>
      </div>
    );
  }
}

export default App;
