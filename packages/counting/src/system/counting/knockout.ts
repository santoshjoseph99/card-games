import ICountingSystem from './ICountingSystem';
import { Card, Rank } from 'deckjs';

export default class KnockoutCounting implements ICountingSystem {
  getCount(card: Card): number {
    if (card.rank === Rank.Ace ||
      card.rank === Rank.Ten ||
      card.rank === Rank.Jack ||
      card.rank === Rank.Queen ||
      card.rank === Rank.King) {
      return -1;
    } else if (card.rank === Rank.Two ||
      card.rank === Rank.Three ||
      card.rank === Rank.Four ||
      card.rank === Rank.Five ||
      card.rank === Rank.Six ||
      card.rank === Rank.Seven) {
      return 1;
    } else {
      return 0;
    }
  }
}