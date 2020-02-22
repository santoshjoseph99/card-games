import { Card } from 'blackjack-counting';

export default interface IPlayer {
  cards: Card[];
  score: number;
  disableHit: boolean;
}
