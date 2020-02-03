import React from 'react';
import './App.css';
import BlackjackCounterUX from './components/BlackjackCounterUX';

/*
1. pick counting system
2. blackjack play. 
      split hands
      double down
      surrender
      insurance
      change stand button to "something else" when player busts or natural
4. user login (save scores)
5. automatic next hand option
6. side count systems support
7. deck options (number, card visual types)
9. refactor into better components (lerna.js for package management).
  * separate logic and UX from the blackjackCounterUX class
a. TESTING
c. CSS transitions (show deck)...then animate cards from deck to hand and also flipping dealer card
d. check for end of cards
e. show number of wins/losses/push
*/

class App extends React.Component<{}, {}> {
  render() {
    return <BlackjackCounterUX />;
  }
}

export default App;
