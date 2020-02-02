import React from 'react';
import { CardSize } from './CardImage';
import CardsContainer from './CardsContainer';
import { Card } from 'blackjack-counting';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { StyleSheet, css } from 'aphrodite';

export interface IPlayerProps {
  cards: Card[];
  disableHit: boolean;
  actionCb: (p: number, x: boolean) => void;
  name: string;
  score: number;
}

const Player: React.FC<IPlayerProps> = (props: IPlayerProps) => {
  const { cards, actionCb, score, disableHit } = props;
  const getCard = React.useCallback(() => actionCb(1, true), [actionCb]);
  const stand = React.useCallback(() => actionCb(1, false), [actionCb]);

  return (
    <div className={css(styles.playerContainer)}>
      <Label>Player: {score}</Label>
      <div className={css(styles.buttonContainer)}>
        <DefaultButton onClick={getCard} disabled={disableHit}>Hit</DefaultButton>
        <DefaultButton onClick={stand}>Stand</DefaultButton>
      </div>
      <CardsContainer list={cards} size={CardSize.small} />
    </div>
  );
}

const styles = StyleSheet.create({
  playerContainer: {
    paddingTop: 20
  },
  buttonContainer: {
    padding: 10,
  }
});

export default Player;