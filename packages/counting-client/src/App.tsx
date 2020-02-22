import React from 'react';
import './App.css';
import BlackjackCounterUX from './components/BlackjackCounterUX';
import { Provider } from 'unistore/react';
import store from './store/store';

class App extends React.Component<{}, {}> {
  render() {
    return (
    <Provider store={store}>
      <BlackjackCounterUX />
    </Provider>
    );
  }
}

export default App;
/*
* blackjack play. 
      split hands
      double down
      surrender
      insurance
      change stand button to "something else" when player busts or natural
* user login (save scores)
* automatic next hand option
* side count systems support
* deck options (number, card visual types)
* separate logic and UX from the blackjackCounterUX class
* blackjack game class
  this should return available actions to player (logic should live)
* TESTING
* CSS transitions (show deck)...then animate cards from deck to hand and also flipping dealer card
* check for end of cards
* try new links for CDN
* add mobx or unistore for state management
*/
