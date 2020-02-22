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

// const URL = '/images/PNG';
const URL = 'https://sjcards.s3-us-west-1.amazonaws.com';

const CardImage: React.FC<ICardProps> = (props: ICardProps) => {
  const { card, size } = props;
  let cardTypeClass;
  if (size === CardSize.small) {
    cardTypeClass = css(styles.cardSmall);
  } else if (size === CardSize.medium) {
    cardTypeClass = css(styles.cardMedium);
  }
  const src = card.faceUp ?
    `${URL}/${card.toShortString().toUpperCase()}.png` :
    `${URL}/yellow_back.png`;

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
  cardMedium: {
    height: 160,
    width: 120,
    margin: 5,
  }
});