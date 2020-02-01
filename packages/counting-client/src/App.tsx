import React from 'react';
import './App.css';
import BlackjackCounterUX from './components/BlackjackCounterUX';

/*
1. pick counting system (veryify counting is working)
2. blackjack play. 
      split hands
      double down
      surrender
      insurance
      change stand button to "something else" when player busts or natural
3. more attractive visuals (ms fabric)
4. user login (save scores)
5. automatic next hand option
6. side count systems support
7. deck options (number, card visual types)
8. deploy website
9. refactor into better components (lerna.js for package management).
a. TESTING
*/

class App extends React.Component<{}, {}> {

  render() {
    return (
      <>
        <BlackjackCounterUX />
      </>
    );
  }
}

export default App;
