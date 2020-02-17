import { BlackjackDeck, Card, Rank, Suit } from 'deckjs';
import Hand from './hand';
import { max, min } from 'lodash';
import ICountingSystem, { ICountingSystems } from './system/counting/ICountingSystem';
import LowHighCounting from './system/counting/low-high';
import KnockoutCounting from './system/counting/knockout';

export type CardCallback = (player: number, card: Card) => void;
export {
  Card,
  Rank,
  Suit
}

const wait = (ms: number) => new Promise((r, j) => setTimeout(r, ms));

export default class BlackjackCounter {
  private deck: BlackjackDeck;
  private numOfDecks: number;
  private numOfPlayers: number;
  private countNum: number;
  private countingSystem: ICountingSystem;

  constructor(countingSystem:ICountingSystems = ICountingSystems.LowHigh, numOfDecks: number = 6, numOfPlayers: number = 1) {
    // TODO: strategyType
    this.numOfDecks = numOfDecks;
    this.numOfPlayers = numOfPlayers;
    this.deck = new BlackjackDeck(numOfDecks);
    this.countNum =  (-1 * numOfDecks * 4) + 4;
    if(countingSystem === ICountingSystems.LowHigh) {
      this.countingSystem = new LowHighCounting();
    } else if(countingSystem === ICountingSystems.KnockOut) {
      this.countingSystem = new KnockoutCounting();
    }
  }

  get count() {
    return this.countNum;
  }

  public shuffle(): void {
    this.deck.shuffle();
  }

  public startGame(): void {
    this.countNum =  (-1 * this.numOfDecks * 4) + 4;
  }

  public async startHand(cb: CardCallback): Promise<void> {
    const d1 = this.deck.getCard();
    const d2 = this.deck.getCard();
    const p1 = this.deck.getCard();
    const p2 = this.deck.getCard();
    cb(1, p1);
    await wait(200);
    this.countNum += this.getCount(p1);
    cb(0, d1);
    await wait(200);
    this.countNum += this.getCount(d1);
    cb(1, p2);
    await wait(200);
    this.countNum += this.getCount(p2);
    cb(0, d2);
    await wait(200);
    this.countNum += this.getCount(d2);
  }

  public endGame(): void {
  }

  public async getCard(): Promise<Card> {
    const c = this.deck.getCard();
    this.countNum += this.getCount(c);
    await wait(200);
    return c;
  }

  public getCountFromCards(cards: Card[]): number {
    return cards.map(this.getCount).reduce((a: number, b: number) => a + b, 0);
  }

  public getBlackjackScore(cards: Card[]): number[] {
    const results = Hand.getHandValues(cards);
    return results; 
  }

  public isSoftSeventeen(cards: Card[]): boolean {
    return cards[0].rank === Rank.Ace && cards[1].rank === Rank.Six ||
      cards[1].rank === Rank.Ace && cards[0].rank === Rank.Six;
  }

  public getHighestNonBustScore(scores: number[]): number {
    return max(scores.filter(x => x < 22)) || 0;
  }

  public getLowestBustScore(scores: number[]): number {
    return min(scores.filter(x => x > 21)) || 0;
  }

  public getCount(card: Card): number {
    return this.countingSystem.getCount(card);
  }
}