import React from 'react';
import './App.css';
import Dealer from './components/Dealer';
import Player from './components/Player';
import BlackjackCounter, { Card } from 'blackjack-counting';

interface IAppState {
  cards: Card[][]
}

class App extends React.Component<{}, IAppState> {
  private blackjackCounter:BlackjackCounter;
  private cards:Card[][];

  constructor(props:any) {
    super(props);
    this.blackjackCounter = new BlackjackCounter(this.cardCallback.bind(this));
    this.cards = [];
    this.cards[0] = [];
    this.cards[1] = [];
    this.state = {
      cards: this.cards
    }
  }

  cardCallback(player: number, card: Card) {
    // called by blackjackCounter to deal cards
    console.log(player, card);
    this.cards[player].push(card);
    this.setState({
      cards: this.cards
    })
  }

  actionCallback(player: number, hit:boolean) {
    // called when a player makes an action
    if(hit) {
      const card = this.blackjackCounter.getCard();
      this.cards[player].push(card);
      this.setState({
        cards: this.cards
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
    console.log('RENDER1:', this.state.cards[0])
    console.log('RENDER2:', this.state.cards[1])
    return (
      <div>
        <Dealer cards={this.state.cards[0]} actionCb={this.actionCallback.bind(this)}/>
        <Player cards={this.state.cards[1]} actionCb={this.actionCallback.bind(this)}/>
        <div>{this.blackjackCounter.count}</div>
      </div>
    );
  }
}

export default App;
