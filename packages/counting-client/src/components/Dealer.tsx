import React from 'react'
import { CardSize } from './Card';
import { Card } from 'blackjack-counting';
import CardsContainer from './CardsContainer';

export interface IDealerProps {
  cards: Card[];
}

const Dealer: React.FC<IDealerProps> = (props: IDealerProps) => {
  const {cards} = props;
  const cardsStrList = cards.map(c => c.toShortString());

  return (
    <div>
      <div>
        <div>Dealer</div>
        <CardsContainer list={cardsStrList} size={CardSize.small} />
      </div>
    </div>
  );
}

export default Dealer;