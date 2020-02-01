import React from 'react'
import { CardSize } from './CardImage';
import { Card } from 'blackjack-counting';
import CardsContainer from './CardsContainer';

export interface IDealerProps {
  cards: Card[];
  score: number;
}

const Dealer: React.FC<IDealerProps> = (props: IDealerProps) => {
  const { cards, score } = props;

  return (
    <>
      <div><span>{`Dealer (Score: ${score})`}</span> </div>
      <CardsContainer list={cards} size={CardSize.small} />
    </>
  );
}

export default Dealer;