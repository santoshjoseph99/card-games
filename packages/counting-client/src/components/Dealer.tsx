import React from 'react'
import { CardSize } from './CardImage';
import { Card } from 'blackjack-counting';
import CardsContainer from './CardsContainer';
import { Label } from 'office-ui-fabric-react/lib/Label';

export interface IDealerProps {
  cards: Card[];
  score: number;
}

const Dealer: React.FC<IDealerProps> = (props: IDealerProps) => {
  const { cards, score } = props;
  const scoreStr = cards.some(c => c.faceUp === false) ? '' : `Score ${score}`;

  return (
    <>
      <Label>{`Dealer ${scoreStr}`}</Label>
      <CardsContainer list={cards} size={CardSize.small} />
    </>
  );
}

export default Dealer;