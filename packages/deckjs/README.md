
Simple way to create multiple decks.

1 deck:
````
  let deck = new Deck(1);
````

1 deck with 2 jokers
````
  let deck = new Deck(1, 2);
````

6 decks
````
  let deck = new Deck(6);
````

Remember to `shuffle` before using.

Also only one method to get a card: `getCard()`

If all cards are used then `null` is returned.