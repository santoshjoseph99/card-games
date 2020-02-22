import { IStoreState } from './store';

export interface IActions {
  endHand: (event: any, state:IStoreState) => any;
}
// const actions = (store:Store<IStoreState>) => ({
const actions = (store:any) => ({
  // Actions can just return a state update:
  endHand(state:IStoreState) {
    console.log('endHand:', state);
    return { handEnded: true };
  },
  
});

export default actions;
