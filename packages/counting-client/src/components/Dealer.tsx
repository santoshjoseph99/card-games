import React from 'react'
import { CardSize } from './Card';
import { Card } from 'blackjack-counting';
import CardsContainer from './CardsContainer';

export interface IDealerProps {
  cards: Card[];
  disableHit: boolean;
  actionCb: (p:number, x:boolean) => void;
}

const Dealer: React.FC<IDealerProps> = (props: IDealerProps) => {
  const {cards, actionCb, disableHit} = props;
  const getCard = React.useCallback(() => actionCb(0, true), [actionCb]);
  const stand = React.useCallback(() => actionCb(0, false), [actionCb]);
  const cardsStrList = cards.map(c => c.toShortString());

  return (
    <div>
      <div>
        <div>Dealer</div>
        <button onClick={getCard} disabled={disableHit}>Hit</button>
        <button onClick={stand}>Stand</button>
        <CardsContainer list={cardsStrList} size={CardSize.small} />
      </div>
    </div>
  );
}

export default Dealer;