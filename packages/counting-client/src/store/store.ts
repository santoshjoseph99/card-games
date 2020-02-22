import createStore from 'unistore';
import IPlayer from '../components/IPlayer';
import IDealer from '../components/IDealer';
import IScore from '../components/IScore';
import { Card } from 'blackjack-counting';

export interface IStoreState {
  handEnded: boolean,
  player: IPlayer;
  dealer: IDealer;
  cards: Card[];
  score: IScore;
  disableStand: boolean;
  test: string;
}

const store = createStore<IStoreState>({
    handEnded: false,
    player: {
      cards: [],
      score: 0,
      disableHit: false,
    },
    dealer:  {
      cards: [],
      score: 0,
    },
    cards: [],
    score: {
      playerWin: 0,
      dealerWin: 0,
      push: 0,
      message: '',
    },
    disableStand: false,
    test: 'my test',
  });

export default store;