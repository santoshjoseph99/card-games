import { Card } from "deckjs";

export default interface ICountingSystem {
  getCount(card: Card): number; 
}

export enum ICountingSystems {
  Unknown = 0,
  LowHigh = 1,
  KnockOut = 2
};