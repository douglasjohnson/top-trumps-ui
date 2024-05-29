import Card from '../types/Card';

const shuffle = (cards: Card[]) => {
  const shuffledCards = [...cards];
  let currentIndex = shuffledCards.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffledCards[currentIndex], shuffledCards[randomIndex]] = [shuffledCards[randomIndex], shuffledCards[currentIndex]];
  }
  return shuffledCards;
};

export default shuffle;
