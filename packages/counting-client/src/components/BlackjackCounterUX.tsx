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

interface Score {
  playerWin: number;
  dealerWin: number;
  push: number;
  message: string;
}

interface IAppState {
  handEnded: boolean,
  player: Player;
  dealer: Dealer;
  cards: Card[];
  score: Score;
  disableStand: boolean;
}

function getHandResult(score:Score) {
  return `${score.message}: Player ${score.playerWin} Dealer ${score.dealerWin} Push ${score.push}`;
}

function setHandResult(blackjackCounter:BlackjackCounter, dealer:Dealer, player:Player, score:Score) {
  const dealerScores = blackjackCounter.getBlackjackScore(dealer.cards);
  const dealerScore = blackjackCounter.getHighestNonBustScore(dealerScores);
  const playerScores = blackjackCounter.getBlackjackScore(player.cards);
  const playerScore = blackjackCounter.getHighestNonBustScore(playerScores);

  if (playerScore === 0) {
    score.message = 'Dealer wins, Player busts';
    score.dealerWin += 1;
  } else if (dealerScore === 0) {
    score.message = 'Player wins, Dealer busts';
    score.playerWin += 1;
  } else if (playerScore === dealerScore) {
    score.message = 'Push!';
    score.push += 1;
  } else if (playerScore > dealerScore) {
    score.message = 'Player Wins';
    score.playerWin += 1;
  } else if (playerScore < dealerScore) {
    score.message = 'Dealer Wins';
    score.dealerWin += 1;
  }
}

interface IBlackjackCounterProps {
  blackjackCounter: BlackjackCounter;
}

const BlackjackCounterUX = (props:IBlackjackCounterProps) => {
  const {blackjackCounter} = props;
  const [player, setPlayer] = React.useState({
    cards: [],
    score: 0,
    disableHit: false,
  });
  const [dealer, setDealer] = React.useState({
    cards: [],
    score: 0
  });
  const [cards, setCards] = React.useState<Card[]>([]);
  const [gameScore, setGameScore] = React.useState({
    playerWin: 0,
    dealerWin: 0,
    push: 0,
    message: ''
  });
  const [handEnded, setHandEnded] = React.useState(false);
  const [disableStand, setDisableStand] = React.useState(false);
  const cardCallback = React.useCallback((playerNum:number, card:Card) => {
    if (playerNum === 0) {
      setDealer(Object.assign(dealer, {cards: [...cards, card]}));
      setCards([...cards, card]);
      const scores = blackjackCounter.getBlackjackScore(dealer.cards);
      dealer.score = blackjackCounter.getHighestNonBustScore(scores);
      if (dealer.cards.length === 2 && Hand.isNatural(dealer.cards)) {
        player.disableHit = true;
        setPlayer(player);
        setDealer(dealer);
        setHandEnded(true);
      }
      if (dealer.cards.length === 2) {
        card.faceUp = Hand.isNatural(dealer.cards) ? true : false;
      }
    } else {
      setPlayer(Object.assign(player, {cards: [...cards, card]}));
      setCards([...cards, card]);
      const scores = blackjackCounter.getBlackjackScore(player.cards);
      player.score = blackjackCounter.getHighestNonBustScore(scores);
      if (player.cards.length === 2 && Hand.isNatural(player.cards)) {
        player.disableHit = true;
      }
      setPlayer(player);
    }
  }, [blackjackCounter, cards, dealer, player]);
  const newHand = React.useCallback(() => {
    setHandEnded(false);
    setDisableStand(false);
    setPlayer({
      cards: [],
      score: 0,
      disableHit: false,
    });
    setDealer({
      cards: [],
      score: 0,
    });
    blackjackCounter.startHand(cardCallback);
  }, [blackjackCounter, cardCallback]);
  const actionCallback = React.useCallback(async (playerNum: number, hit: boolean) => {
    if (hit) {
      const card = await blackjackCounter.getCard();
      setCards([...cards, card]);
      setPlayer(Object.assign(player, {cards: [...cards, card]}));
      const scores = blackjackCounter.getBlackjackScore(player.cards);
      const score = blackjackCounter.getHighestNonBustScore(scores);
      if (score) {
        player.score = score;
      } else {
        player.score = blackjackCounter.getLowestBustScore(scores);
        player.disableHit = true;
      }
    } else {
      player.disableHit = true;
      setDisableStand(true);
      // dealer.cards[1].faceUp = true;
      setDealer(Object.assign(dealer, {cards:[dealer.cards[0], Object.assign(dealer.cards[1], {faceUp: true})]}));
      setPlayer(player);
      if (player.score > 21 || Hand.isNatural(player.cards)) {
        setHandResult(blackjackCounter, dealer, player, gameScore);
        setGameScore(gameScore);
        setHandEnded(true);
        return;
      }
      let scores = blackjackCounter.getBlackjackScore(dealer.cards);
      let score = blackjackCounter.getHighestNonBustScore(scores);
      if (score) {
        while (score < 17) {
          const card = await blackjackCounter.getCard();
          setCards([...cards, card]);
          setDealer(Object.assign(dealer, {cards: [...cards, card]}));
          scores = blackjackCounter.getBlackjackScore(dealer.cards);
          score = blackjackCounter.getHighestNonBustScore(scores);
          dealer.score = score === 0 ?
            blackjackCounter.getLowestBustScore(scores) : score;
          setPlayer(player);
          setDealer(dealer);
          setCards(cards);
          if (score === 0) {
            break;
          }
        }
      } else {
        //bust
      }
      setHandResult(blackjackCounter, dealer, player, gameScore);
      setGameScore(gameScore);
      setHandEnded(true);
    }
  }, [blackjackCounter, cards, dealer, gameScore, player]);
  React.useEffect(() => {
    blackjackCounter.shuffle();
    blackjackCounter.startGame();
    blackjackCounter.startHand(cardCallback);
  });

  return (
    <div>
      <PrimaryButton onClick={newHand}>New Hand</PrimaryButton>
      <Player
        name={'me'}
        score={player.score}
        cards={player.cards}
        actionCb={actionCallback}
        handEnded={handEnded}
        disableStand={disableStand}
        disableHit={player.disableHit} />
      <Dealer
        cards={dealer.cards}
        score={dealer.score} />
      <div className={css(styles.winnerContainer)}>
        {handEnded &&
          <span className={css(styles.winner)}>
            Result: {getHandResult(gameScore)}
          </span>}
      </div>
      <Count count={blackjackCounter.count} />
      <Cards cards={cards} getCount={blackjackCounter.getCount} />
    </div>
  );
}

/*
class BlackjackCounterUX2 extends React.Component<{}, IAppState> {
  private blackjackCounter: BlackjackCounter;
  private handEnded: boolean;
  private player: Player;
  private dealer: Dealer;
  private cards: Card[];
  private score: Score;
  private disableStand: boolean;

  constructor(props: any) {
    super(props);
    handEnded = false;
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

x
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
}
*/

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
