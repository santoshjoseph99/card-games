import React from 'react';
import IPlayerProps from './IPlayerProps'
import { CardSize } from './Card';
import CardsContainer from './CardsContainer';

const Player: React.FC<IPlayerProps> = (props:IPlayerProps) => {
  const {cards, actionCb} = props;
  const getCard = React.useCallback(() => actionCb(1, true), [actionCb]);
  const stand = React.useCallback(() => actionCb(1, false), [actionCb]);
  const cardsStrList = cards.map(c => c.toShortString());

  return (
    <div>
      <div>
        <button onClick={getCard}>Hit</button>
        <button onClick={stand}>Stand</button>
        <CardsContainer list={cardsStrList} size={CardSize.small} />
      </div>
    </div>
  );
}

export default Player;