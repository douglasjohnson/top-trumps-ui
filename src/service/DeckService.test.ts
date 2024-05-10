import { deleteDeck, findAll, save, update } from './DeckService';
import Http from './Http';
import PersistedDeck from '../types/PersistedDeck';

vitest.mock('./Http');

describe('Deck Service', () => {
  describe('findAll', () => {
    const mockedHttpGet = vitest.mocked(Http.get);
    beforeEach(() => {
      mockedHttpGet.mockImplementation(() => new Promise(vi.fn()));
    });
    it('should GET all decks', () => {
      findAll();

      expect(Http.get).toHaveBeenCalledWith('/decks');
    });
    it('should resolve decks on success', async () => {
      const decks: PersistedDeck[] = [];
      mockedHttpGet.mockResolvedValue({ data: decks });

      await expect(findAll()).resolves.toBe(decks);
    });
    it('should reject on failure', async () => {
      mockedHttpGet.mockRejectedValue('error');

      await expect(findAll()).rejects.toMatch('error');
    });
  });
  describe('save', () => {
    const mockedHttpPost = vitest.mocked(Http.post);
    const deck = {
      name: 'Deck 1',
      imageUrl: 'http://imageurl',
      attributes: [],
      cards: [],
    };
    beforeEach(() => {
      mockedHttpPost.mockImplementation(() => new Promise(vi.fn()));
    });
    it('should POST deck', () => {
      save(deck);

      expect(Http.post).toHaveBeenCalledWith('/decks', deck);
    });
    it('should resolve deck on success', async () => {
      const savedDeck = { ...deck, id: 1 };
      mockedHttpPost.mockResolvedValue({ data: savedDeck });

      await expect(save(deck)).resolves.toBe(savedDeck);
    });
    it('should reject on failure', async () => {
      mockedHttpPost.mockRejectedValue('error');

      await expect(save(deck)).rejects.toMatch('error');
    });
  });
  describe('update', () => {
    const mockedHttpPatch = vitest.mocked(Http.patch);
    const deck = {
      id: '1',
      name: 'Deck 1',
      imageUrl: 'http://imageurl',
      attributes: [],
      cards: [],
    };
    beforeEach(() => {
      mockedHttpPatch.mockImplementation(() => new Promise(vi.fn()));
    });
    it('should PATCH deck', () => {
      update(deck);

      expect(Http.patch).toHaveBeenCalledWith('/decks/1', deck);
    });
    it('should resolve deck on success', async () => {
      const updatedDeck = { ...deck };
      mockedHttpPatch.mockResolvedValue({ data: updatedDeck });

      await expect(update(deck)).resolves.toBe(updatedDeck);
    });
    it('should reject on failure', async () => {
      mockedHttpPatch.mockRejectedValue('error');

      await expect(update(deck)).rejects.toMatch('error');
    });
  });
  describe('delete', () => {
    const mockedHttpDelete = vitest.mocked(Http.delete);
    const deck = {
      id: '1',
      name: 'Deck 1',
      imageUrl: 'http://imageurl',
      attributes: [],
      cards: [],
    };
    beforeEach(() => {
      mockedHttpDelete.mockImplementation(() => new Promise(vi.fn()));
    });
    it('should DELETE deck', () => {
      deleteDeck(deck);

      expect(Http.delete).toHaveBeenCalledWith('/decks/1');
    });
    it('should resolve deck on success', async () => {
      mockedHttpDelete.mockResolvedValue({});

      await expect(deleteDeck(deck)).resolves.toBe(deck);
    });
    it('should reject on failure', async () => {
      mockedHttpDelete.mockRejectedValue('error');

      await expect(deleteDeck(deck)).rejects.toMatch('error');
    });
  });
});
