import { Card } from 'blackjack-counting';

export default interface IPlayerProps {
  cards: Card[];
  disableHit: boolean;
  actionCb: (p:number, x:boolean) => void;
  name: string;
  score: number;
}