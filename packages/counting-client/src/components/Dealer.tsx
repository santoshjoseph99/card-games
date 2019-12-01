import React from 'react'
import IPlayerProps from './IPlayerProps'

const Dealer: React.FC<IPlayerProps> = (props: IPlayerProps) => {
  const {cards, actionCb} = props;
  const getCard = React.useCallback(() => actionCb(0, true), []);
  const stand = React.useCallback(() => actionCb(0, false), []);
  const cardsStr = cards.map(c => c.toShortString()).join(',');
  return (
    <div>
      <div>
        <button onClick={getCard}>Hit</button>
        <button onClick={stand}>Stand</button>
        <span>Dealer: {cardsStr}</span>
      </div>
    </div>
  );
}

export default Dealer;