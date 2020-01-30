import React from 'react';
import CardImage, { CardSize } from './CardImage';
import { Card } from 'blackjack-counting';

export interface ICardsProps {
  list: Card[];
  size: CardSize;
}

const CardsContainer: React.FC<ICardsProps> = (props: ICardsProps) => {
  return (
    <>
      {
        props.list.map((c:Card, i:number) => <CardImage key={i} card={c} size={props.size} />)
      }
    </>
  )
};

export default CardsContainer;