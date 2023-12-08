const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

function* gameParser(input) {
  let line = '';
  for (let index = 0; index < input.length; index++ ) {
    if(input[index].match(/\n/g)) {
      const [ cardName, gameValues ] = line.split(':');
      const cardNumber = Number(cardName.trim().split(/\s+/)[1]);
      let [ winningNumbers, givenNumbers ] = gameValues.trim().split('|');
      winningNumbers = winningNumbers.trim().split(/\s+/).map((number) => Number(number.trim()));
      givenNumbers = givenNumbers.trim().split(' ').map((number) => Number(number.trim()));

      line = ''
      yield { 
        cardNumber, 
        winningNumbers, 
        givenNumbers }
    } else {
      line += input[index];
    }
  }
}

const originalCards = Array.from(gameParser(input));

// Part 1
const total = originalCards.reduce((total, currentCard) => {
  let cardTotal = 0;
  const { givenNumbers, winningNumbers } = currentCard;
  const winners = [];
  givenNumbers.forEach(givenNumber => {
    if (winningNumbers.includes(givenNumber)) {
      winners.push(givenNumber);
    }
  });
  currentCard.winners = winners;
  currentCard.cardsWon = winners.map((winner, index) => currentCard.cardNumber + 1);
  winners.forEach(() => {
    cardTotal > 0 ? cardTotal *= 2 : cardTotal++;
  });
  total += cardTotal;
  return total;
}, 0)

console.log(total);

// Part 2
originalCards.reverse().forEach((card, index) => {
  if (card.cardsWon) {
    card.winScore = card.cardsWon.length;
    card.cardsWon.forEach((wonCard, wonCardIndex) => {
      card.winScore += originalCards[index - (wonCardIndex + 1)].winScore;
    })
  }
});

console.log(originalCards.reduce((total, card) => {
  total += card.winScore
  return total;
}, 0) + originalCards.length);
