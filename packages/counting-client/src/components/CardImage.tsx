import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Card } from 'blackjack-counting';

export enum CardSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

export interface ICardProps {
  size: CardSize;
  card: Card;
}

const CardImage: React.FC<ICardProps> = (props: ICardProps) => {
  const { card, size } = props;
  let cardTypeClass;
  if (size === CardSize.small) {
    cardTypeClass = css(styles.cardSmall);
  }
  const src = card.faceUp ?
    `/images/PNG/${card.toShortString()}.png` :
    '/images/PNG/yellow_back.png';

  return (
    <img className={cardTypeClass} src={src} alt={"TODO"} />
  );
};

export default CardImage;

const styles = StyleSheet.create({
  cardSmall: {
    height: 80,
    width: 60,
    margin: 5,
  },
});