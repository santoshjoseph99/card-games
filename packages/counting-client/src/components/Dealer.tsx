import React from 'react'
import { CardSize } from './Card';
import { Card } from 'blackjack-counting';
import CardsContainer from './CardsContainer';

export interface IDealerProps {
  cards: Card[];
  score: number;
}

const Dealer: React.FC<IDealerProps> = (props: IDealerProps) => {
  const {cards, score} = props;
  const cardsStrList = cards.map(c => c.toShortString());

  return (
    <div>
      <div>
        <div><span>{`Dealer (Score: ${score})`}</span> </div>
        <CardsContainer list={cardsStrList} size={CardSize.small} />
      </div>
    </div>
  );
}

export default Dealer;