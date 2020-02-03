import React from 'react';
import Dealer from './Dealer';
import Player from './Player';
import Count from './Count';
import { BlackjackCounter, Card, Hand } from 'blackjack-counting';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import Cards from './Cards';
import { StyleSheet, css } from 'aphrodite';

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
  cards: Card[];
}

class BlackjackCounterUX extends React.Component<{}, IAppState> {
  private blackjackCounter: BlackjackCounter;
  private handEnded: boolean;
  private player: Player;
  private dealer: Dealer;
  private cards: Card[];

  constructor(props: any) {
    super(props);
    this.handEnded = false;
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
    this.state = {
      handEnded: this.handEnded,
      player: this.player,
      dealer: this.dealer,
      cards: [],
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
      this.dealer.cards[1].faceUp = true;
      this.setState({
        player: this.player,
        dealer: this.dealer,
        cards: this.cards,
      });
      if (this.player.score > 21 || Hand.isNatural(this.player.cards)) {
        this.setState({
          handEnded: true
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
      this.setState({
        handEnded: true
      });
    }
  }

  newGame() {
    this.blackjackCounter.shuffle();
    this.blackjackCounter.startGame();
    this.blackjackCounter.startHand(this.cardCallback.bind(this));
  }

  componentDidMount() {
    this.newGame();
  }

  newHand = async () => {
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
    await this.blackjackCounter.startHand(this.cardCallback.bind(this));
  }

  getWinner() {
    const dealerScores = this.blackjackCounter.getBlackjackScore(this.dealer.cards);
    const dealerScore = this.blackjackCounter.getHighestNonBustScore(dealerScores);
    const playerScores = this.blackjackCounter.getBlackjackScore(this.player.cards);
    const playerScore = this.blackjackCounter.getHighestNonBustScore(playerScores);
    if (playerScore === 0) {
      return 'Dealer wins, Player busts';
    }
    if (dealerScore === 0) {
      return 'Player wins, Dealer busts';
    }
    if (playerScore === dealerScore) {
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
          <PrimaryButton onClick={this.newHand}>New Hand</PrimaryButton>
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
        <div className={css(styles.winnerContainer)}>
          {this.state.handEnded &&
            <span className={css(styles.winner)}>
              Result: {this.getWinner()}
            </span>}
        </div>
        <Count count={this.blackjackCounter.count} />
        <Cards cards={this.state.cards} getCount={this.blackjackCounter.getCount} />
      </div>
    );
  }
}

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
