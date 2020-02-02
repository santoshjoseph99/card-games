import React from 'react';
import { Card } from 'blackjack-counting';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import CardImage, { CardSize } from './CardImage';
import { Stack } from 'office-ui-fabric-react';

export interface ICardsProps {
  cards: Card[];
  getCount: (card: Card) => number;
}

interface ICardsWithCountProps {
  card1: Card;
  card2: Card;
  count: number;
}

const CardsWithCount: React.FC<ICardsWithCountProps> = (props: ICardsWithCountProps) => {
  const { card1, card2, count } = props;
  return (
    <Stack horizontal>
      <CardImage card={card1} size={CardSize.small} />
      {card2 && <CardImage card={card2} size={CardSize.small} />}
      <span>{count}</span>
    </Stack>
  )
}

const Cards: React.FC<ICardsProps> = (props: ICardsProps) => {
  const { cards, getCount } = props;
  const [showCards, setShowCards] = React.useState(false);
  const handleShowCards = React.useCallback(() => setShowCards(!showCards), [showCards]);
  const cardPairs: ICardsWithCountProps[] = [];
  for (let i = 0; i < cards.length; i += 2) {
    cardPairs.push({
      card1: cards[i],
      card2: cards[i + 1],
      count: getCount(cards[i]) + (cards[i + 1] ? getCount(cards[i + 1]) : 0)
    });
  }
  return (
    <>
      <DefaultButton onClick={handleShowCards}>Show All Cards</DefaultButton>
      {showCards &&
        cardPairs.map((x: ICardsWithCountProps, i: number) => <CardsWithCount key={i} {...x} />)}
    </>
  );
}

export default Cards;