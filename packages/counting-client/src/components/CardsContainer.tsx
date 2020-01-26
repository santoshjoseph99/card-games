import React from 'react';
import Card, { CardSize } from './Card';

export interface ICardsProps {
  list: string[];
  size: CardSize;
}

const CardsContainer: React.FC<ICardsProps> = (props: ICardsProps) => {
  return (
    <>
      {
        props.list.map((c:string, i:number) => <Card key={i} name={c} size={props.size} />)
      }
    </>
  )
};

export default CardsContainer;