import React from 'react';
import Dealer from './Dealer';
import Player from './Player';
import Count from './Count';
import { BlackjackCounter, Card, Hand } from 'blackjack-counting';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import Cards from './Cards';
import { StyleSheet, css } from 'aphrodite';
import { connect } from 'unistore/react';
import IPlayer from './IPlayer';
import IDealer from './IDealer';
import IScore from './IScore';
import actions, { IActions } from '../store/actions';
import { IStoreState } from '../store/store';

interface IAppState {
  handEnded: boolean,
  player: IPlayer;
  dealer: IDealer;
  cards: Card[];
  score: IScore;
  disableStand: boolean;
}

const BlackjackCounterUX = connect(['test', 'handEnded'], actions)(
class BlackjackCounterUX extends React.Component<IStoreState & IActions, IAppState> {
  private blackjackCounter: BlackjackCounter;
  private handEnded: boolean;
  private player: IPlayer;
  private dealer: IDealer;
  private cards: Card[];
  private score: IScore;
  private disableStand: boolean;

  constructor(props: any) {
    super(props);
    this.handEnded = false;
    this.disableStand = false;
    this.blackjackCounter = new BlackjackCounter();
    this.player = {
      cards: [],
      score: 0,
      disableHit: false,
    };
    this.dealer = {
      cards: [],
      score: 0,
    };
    this.cards = [];
    this.score = {
      playerWin: 0,
      dealerWin: 0,
      push: 0,
      message: '',
    };
    this.state = {
      handEnded: this.handEnded,
      player: this.player,
      dealer: this.dealer,
      cards: [],
      score: this.score,
      disableStand: this.disableStand,
    }
  }

  /**
   * called by blackjackCounter to deal a card
   * @param player 
   * @param card 
   */
  cardCallback(playerNum: number, card: Card) {
    if (playerNum === 0) {
      this.dealer.cards.push(card);
      this.cards.push(card);
      const scores = this.blackjackCounter.getBlackjackScore(this.dealer.cards);
      this.dealer.score = this.blackjackCounter.getHighestNonBustScore(scores);
      if (this.dealer.cards.length === 2 && Hand.isNatural(this.dealer.cards)) {
        this.player.disableHit = true;
        this.handEnded = true;
      }
      if (this.dealer.cards.length === 2) {
        card.faceUp = Hand.isNatural(this.dealer.cards) ? true : false;
      }
    } else {
      this.player.cards.push(card);
      this.cards.push(card);
      const scores = this.blackjackCounter.getBlackjackScore(this.player.cards);
      this.player.score = this.blackjackCounter.getHighestNonBustScore(scores);
      if (this.player.cards.length === 2 && Hand.isNatural(this.player.cards)) {
        this.player.disableHit = true;
      }
    }
    this.setState({
      player: this.player,
      dealer: this.dealer,
      handEnded: this.handEnded,
      cards: this.cards,
    });
  }

  /**
   * called by the player/dealer component to handle the hit/stand action
   * @param player 
   * @param hit 
   */
  async actionCallback(player: number, hit: boolean) {
    if (hit) {
      const card = await this.blackjackCounter.getCard();
      this.cards.push(card);
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
      this.disableStand = true;
      this.dealer.cards[1].faceUp = true;
      this.setState({
        player: this.player,
        dealer: this.dealer,
        cards: this.cards,
        disableStand: this.disableStand,
      });
      if (this.player.score > 21 || Hand.isNatural(this.player.cards)) {
        this.setHandResult();
        this.setState({
          handEnded: true,
          score: this.score,
        });
        return;
      }
      let scores = this.blackjackCounter.getBlackjackScore(this.dealer.cards);
      let score = this.blackjackCounter.getHighestNonBustScore(scores);
      if (score) {
        while (score < 17) {
          const card = await this.blackjackCounter.getCard();
          this.cards.push(card);
          this.dealer.cards.push(card);
          scores = this.blackjackCounter.getBlackjackScore(this.dealer.cards);
          score = this.blackjackCounter.getHighestNonBustScore(scores);
          this.dealer.score = score === 0 ?
            this.blackjackCounter.getLowestBustScore(scores) : score;
          this.setState({
            player: this.player,
            dealer: this.dealer,
            cards: this.cards,
          });
          if (score === 0) {
            break;
          }
        }
      } else {
        //bust
      }
      this.setHandResult();
      this.setState({
        handEnded: true,
        score: this.score,
      });
    }
  }

  newGame() {
    this.blackjackCounter.shuffle();
    this.blackjackCounter.startGame();
    this.score = {
      playerWin: 0,
      dealerWin: 0,
      push: 0,
      message: '',
    };
    this.blackjackCounter.startHand(this.cardCallback.bind(this));
  }

  componentDidMount() {
    this.newGame();
  }

  newHand = async () => {
    this.handEnded = false;
    this.disableStand = false;
    this.player = {
      cards: [],
      score: 0,
      disableHit: false,
    };
    this.dealer = {
      cards: [],
      score: 0,
    };
    this.setState({
      player: this.player,
      dealer: this.dealer,
      handEnded: false,
      score: this.score,
      disableStand: false,
    });
    await this.blackjackCounter.startHand(this.cardCallback.bind(this));
  }

  setHandResult() {
    const dealerScores = this.blackjackCounter.getBlackjackScore(this.dealer.cards);
    const dealerScore = this.blackjackCounter.getHighestNonBustScore(dealerScores);
    const playerScores = this.blackjackCounter.getBlackjackScore(this.player.cards);
    const playerScore = this.blackjackCounter.getHighestNonBustScore(playerScores);

    if (playerScore === 0) {
      this.score.message = 'Dealer wins, Player busts';
      this.score.dealerWin += 1;
    } else if (dealerScore === 0) {
      this.score.message = 'Player wins, Dealer busts';
      this.score.playerWin += 1;
    } else if (playerScore === dealerScore) {
      this.score.message = 'Push!';
      this.score.push += 1;
    } else if (playerScore > dealerScore) {
      this.score.message = 'Player Wins';
      this.score.playerWin += 1;
    } else if (playerScore < dealerScore) {
      this.score.message = 'Dealer Wins';
      this.score.dealerWin += 1;
    }
  }

  getHandResult() {
    return `${this.state.score.message}: Player ${this.state.score.playerWin} Dealer ${this.state.score.dealerWin} Push ${this.state.score.push}`;
  }

  render() {
    console.log('D1:', this.props.test, this.props.handEnded, this.props.endHand);
    // this.props
    return (
      <div>
        <div>
          <PrimaryButton onClick={this.newHand}>New Hand</PrimaryButton>
          <PrimaryButton onClick={this.props.endHand}>End Hand Test</PrimaryButton>
        </div>
        <Player
          name={'me'}
          score={this.state.player.score}
          cards={this.state.player.cards}
          actionCb={this.actionCallback.bind(this)}
          handEnded={this.state.handEnded}
          disableStand={this.state.disableStand}
          disableHit={this.state.player.disableHit} />
        <Dealer
          cards={this.state.dealer.cards}
          score={this.state.dealer.score} />
        <div className={css(styles.winnerContainer)}>
          {this.state.handEnded &&
            <span className={css(styles.winner)}>
              Result: {this.getHandResult()}
            </span>}
        </div>
        <Count count={this.blackjackCounter.count} />
        <Cards cards={this.state.cards} getCount={this.blackjackCounter.getCount} />
      </div>
    );
  }
});

const styles = StyleSheet.create({
  winnerContainer: {
    padding: 10,
    margin: 10
  },
  winner: {
    border: 'yellow 1px solid',
    padding: 10,
    margin: 10
  },
});

export default BlackjackCounterUX;
