import Shuffle from './Shuffle';
import { expect } from 'vitest';

describe('Shuffle', () => {
  it('should return all cards', () => {
    const cards = [...Array(5)].map((_value, index) => ({ name: `Card ${index}`, description: '', imageUrl: '', attributes: [] }));
    const shuffledCards = Shuffle(cards);

    expect(shuffledCards).toEqual(expect.arrayContaining(cards));
  });
});
