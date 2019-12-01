import React from 'react';
import IPlayerProps from './IPlayerProps'

const Player: React.FC<IPlayerProps> = (props:IPlayerProps) => {
  const {cards, actionCb} = props;
  const getCard = React.useCallback(() => actionCb(1, true), []);
  const stand = React.useCallback(() => actionCb(1, false), []);
  const cardsStr = cards.map(c => c.toShortString()).join(',');
  return (
    <div>
      <div>
        <button onClick={getCard}>Hit</button>
        <button onClick={stand}>Stand</button>
        <span>Player: {cardsStr}</span>
      </div>
    </div>
  );
}

export default Player;