import { Card } from 'blackjack-counting';

export default interface IPlayerProps {
  cards: Card[];
  actionCb: (p:number, x:boolean) => void;
}