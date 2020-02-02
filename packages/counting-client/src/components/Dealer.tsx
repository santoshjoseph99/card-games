import React from 'react'
import { CardSize } from './CardImage';
import { Card } from 'blackjack-counting';
import CardsContainer from './CardsContainer';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { StyleSheet, css } from 'aphrodite';

export interface IDealerProps {
  cards: Card[];
  score: number;
}

const Dealer: React.FC<IDealerProps> = (props: IDealerProps) => {
  const { cards, score } = props;
  const scoreStr = cards.some(c => c.faceUp === false) ? '' : `Score ${score}`;

  return (
    <div className={css(styles.dealerContainer)}>
      <Label>{`Dealer ${scoreStr}`}</Label>
      <CardsContainer list={cards} size={CardSize.small} />
    </div>
  );
}

const styles = StyleSheet.create({
  dealerContainer: {
    paddingTop: 20
  },
});

export default Dealer;