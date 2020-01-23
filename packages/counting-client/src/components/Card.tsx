import React from 'react';
import { StyleSheet, css } from 'aphrodite';

export enum CardSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
} 

export interface ICardProps {
  name: string;
  size: CardSize;
}

const Card: React.FC<ICardProps> = (props: ICardProps) => {
  let cardTypeClass;
  if( props.size === CardSize.small) {
    cardTypeClass = css(styles.cardSmall);
  }
  return (
    <img className={cardTypeClass} src={`/images/PNG/${props.name}.png`} alt={"TODO"}/>
  );
};

export default Card;

const styles = StyleSheet.create({
  cardSmall: {
    height: 80,
    width: 60,
    margin: 5,
  },
});