import React from 'react';
import Dealer from './Dealer';
import Player from './Player';
import Count from './Count';
import {BlackjackCounter, Card, Hand} from 'blackjack-counting';

interface Player {
  cards: Card[];
  score: number;
  disableHit: boolean;
}

interface Dealer {
  cards: Card[];
  score: number;
}

interface IAppState {
  handEnded: boolean,
  player: Player;
  dealer: Dealer;
}

class BlackjackCounterUX extends React.Component<{}, IAppState> {
  private blackjackCounter: BlackjackCounter;
  private handEnded: boolean;
  private player: Player;
  private dealer: Dealer;

  constructor(props: any) {
    super(props);
    this.handEnded = false;
    this.blackjackCounter = new BlackjackCounter(this.cardCallback.bind(this));
    this.player = {
      cards: [],
      score: 0,
      disableHit: false,
    };
    this.dealer = {
      cards: [],
      score: 0,
    };
    this.state = {
      handEnded: this.handEnded,
      player: this.player,
      dealer: this.dealer,
    }
  }

  /**
   * called by blackjackCounter to deal a card
   * @param player 
   * @param card 
   */
  cardCallback(playerNum: number, card: Card) {
    if(playerNum === 0) {
      this.dealer.cards.push(card);
      const scores = this.blackjackCounter.getBlackjackScore(this.dealer.cards);
      this.dealer.score = this.blackjackCounter.getHighestNonBustScore(scores);
      if(this.dealer.cards.length === 2 && Hand.isNatural(this.dealer.cards)) {
        this.player.disableHit = true;
        this.handEnded = true;
      }
      if(this.dealer.cards.length === 2){
        card.faceUp = false;
      }
    } else {
      this.player.cards.push(card);
      const scores = this.blackjackCounter.getBlackjackScore(this.player.cards);
      this.player.score = this.blackjackCounter.getHighestNonBustScore(scores);
      if(this.player.cards.length === 2 && Hand.isNatural(this.player.cards)) {
        this.player.disableHit = true;
      }
    }
    this.setState({
      player: this.player,
      dealer: this.dealer,
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
      this.player.cards.push(card);
      const scores = this.blackjackCounter.getBlackjackScore(this.player.cards);
      const score = this.blackjackCounter.getHighestNonBustScore(scores);
      if (score) {
        this.player.score = score;
      } else {
        this.player.score = this.blackjackCounter.getLowestBustScore(scores);
        this.player.disableHit = true;
      }
      this.setState({
        player: this.player,
      });
    } else {
      this.player.disableHit = true;
      this.dealer.cards[1].faceUp = true;
      this.setState({
        player: this.player,
        dealer: this.dealer,
      });
      if(this.player.score > 21 || Hand.isNatural(this.player.cards)) {
        this.setState({
          handEnded: true
        });
        return;
      }
      let scores = this.blackjackCounter.getBlackjackScore(this.dealer.cards);
      let score = this.blackjackCounter.getHighestNonBustScore(scores);
      if (score) {
        while (score < 17) {
          const card = this.blackjackCounter.getCard();
          this.dealer.cards.push(card);
          scores = this.blackjackCounter.getBlackjackScore(this.dealer.cards);
          score = this.blackjackCounter.getHighestNonBustScore(scores);
          this.dealer.score = score === 0 ?
            this.blackjackCounter.getLowestBustScore(scores) : score;
          setTimeout(() => {
            this.setState({
              player: this.player,
              dealer: this.dealer,
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
    this.player = {
      cards: [],
      score: 0,
      disableHit: false
    };
    this.dealer = {
      cards: [],
      score: 0,
    };
    this.setState({
      player: this.player,
      dealer: this.dealer,
      handEnded: false,
    });
    this.blackjackCounter.startHand();
  }

  getWinner() {
    const dealerScores = this.blackjackCounter.getBlackjackScore(this.dealer.cards);
    const dealerScore = this.blackjackCounter.getHighestNonBustScore(dealerScores);
    const playerScores = this.blackjackCounter.getBlackjackScore(this.player.cards);
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
          score={this.state.player.score}
          cards={this.state.player.cards}
          actionCb={this.actionCallback.bind(this)}
          disableHit={this.state.player.disableHit} />
        <Dealer
          cards={this.state.dealer.cards} 
          score={this.state.dealer.score} />
        <Count count={this.blackjackCounter.count} />
        <div>{this.state.handEnded && <span>Result: {this.getWinner()}</span>}</div>
      </div>
    );
  }
}

export default BlackjackCounterUX;
