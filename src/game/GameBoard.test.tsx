import userEvent, { UserEvent } from '@testing-library/user-event';
import { render, screen, within } from '@testing-library/react';
import GameBoard from './GameBoard';

const playerCard = (name: string) => screen.getByRole('heading', { name }).closest('div') as HTMLElement;

describe('Game Board', () => {
  let user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('should have start game button', () => {
    const deck = { id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] };
    render(<GameBoard deck={deck} />);

    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });
  it('should have start game button', () => {
    const deck = { id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] };
    render(<GameBoard deck={deck} />);

    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });
  it('should have player 1 heading', () => {
    const deck = { id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] };
    render(<GameBoard deck={deck} />);

    expect(screen.getByRole('heading', { name: 'Player 1' })).toBeInTheDocument();
  });
  it('should have player 2 heading', () => {
    const deck = { id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] };
    render(<GameBoard deck={deck} />);

    expect(screen.getByRole('heading', { name: 'Player 2' })).toBeInTheDocument();
  });
  it('should have player 1 hand', () => {
    const deck = {
      id: '1',
      name: 'Deck 1',
      imageUrl: '',
      attributes: [{ name: 'A', units: 'm' }],
      cards: [
        { name: 'Card 1', description: '', imageUrl: '', attributes: [{ type: 'A', value: 1 }] },
        { name: 'Card 2', description: '', imageUrl: '', attributes: [{ type: 'A', value: 2 }] },
      ],
    };
    render(<GameBoard deck={deck} />);

    expect(within(screen.getByRole('heading', { name: 'Player 1' }).closest('div') as HTMLElement).getByText('Deck 1')).toBeInTheDocument();
  });
  it('should have player 2 hand', () => {
    const deck = {
      id: '1',
      name: 'Deck 1',
      imageUrl: '',
      attributes: [{ name: 'A', units: 'm' }],
      cards: [
        { name: 'Card 1', description: '', imageUrl: '', attributes: [{ type: 'A', value: 1 }] },
        { name: 'Card 2', description: '', imageUrl: '', attributes: [{ type: 'A', value: 2 }] },
      ],
    };
    render(<GameBoard deck={deck} />);

    expect(within(screen.getByRole('heading', { name: 'Player 2' }).closest('div') as HTMLElement).getByText('Deck 1')).toBeInTheDocument();
  });
  it('should do nothing when clicking hand before game start', async () => {
    const deck = {
      id: '1',
      name: 'Deck 1',
      imageUrl: '',
      attributes: [{ name: 'A', units: 'm' }],
      cards: [
        { name: 'Card 1', description: '', imageUrl: '', attributes: [{ type: 'A', value: 1 }] },
        { name: 'Card 2', description: '', imageUrl: '', attributes: [{ type: 'A', value: 2 }] },
      ],
    };
    render(<GameBoard deck={deck} />);

    const card = playerCard('Player 1');
    await user.click(within(card).getByText('Deck 1'));

    expect(within(card).getByText('Deck 1')).toBeInTheDocument();
  });
  describe('play', () => {
    beforeEach(() => {
      const DECK_SIZE = 4;
      const cards = [...Array(DECK_SIZE)].map((_value, index) => {
        return {
          name: `Card ${index + 1}`,
          description: '',
          imageUrl: '',
          attributes: [
            { type: 'A', value: index + 1 },
            { type: 'B', value: DECK_SIZE - index },
            { type: 'C', value: 0 },
          ],
        };
      });
      const deck = {
        id: '1',
        name: 'Deck 1',
        imageUrl: '',
        attributes: [
          { name: 'A', units: 'm' },
          { name: 'B', units: 'kg' },
          { name: 'C', units: '' },
        ],
        cards,
      };
      render(<GameBoard deck={deck} shuffle={(cards) => cards} />);
    });
    it('should reveal player 1 top card when game starts', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));

      const card = playerCard('Player 1');
      expect(within(card).getByText('Card 1')).toBeInTheDocument();
      expect(within(card).getByText('A - 1')).toBeInTheDocument();
    });
    it('should hide start button when game starts', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));

      expect(screen.queryByRole('button', { name: 'Start' })).not.toBeInTheDocument();
    });
    it('should reveal player 2 top card when attribute selected', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));

      await user.click(screen.getByText('A - 1'));

      const card = playerCard('Player 2');
      expect(within(card).getByText('Card 2')).toBeInTheDocument();
      expect(within(card).getByText('A - 2')).toBeInTheDocument();
    });
    it('should indicate player 1 wins when attribute selected is higher', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));

      await user.click(screen.getByText('B - 4'));

      expect(screen.getByText('Winner: Player 1 - Card 1')).toBeInTheDocument();
    });
    it('should indicate player 2 wins when attribute selected is lower', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));

      await user.click(screen.getByText('A - 1'));

      expect(screen.getByText('Winner: Player 2 - Card 2')).toBeInTheDocument();
    });
    it('should indicate draw when attribute selected is equal', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));

      await user.click(screen.getByText('C - 0'));

      expect(screen.getByText('DRAW')).toBeInTheDocument();
    });
    it('should clear status when next rounds starts ', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));
      await user.click(screen.getByText('B - 4'));

      await user.click(screen.getByRole('button', { name: 'Start' }));

      expect(screen.queryByText('Winner: Player 1 - Card 1')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Start' })).not.toBeInTheDocument();
    });
    it('should reveal player 1 card when next rounds starts after player 1 win', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));
      await user.click(screen.getByText('B - 4'));

      await user.click(screen.getByRole('button', { name: 'Start' }));

      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });
    it('should hide player 2 card when next rounds starts after player 1 win', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));
      await user.click(screen.getByText('B - 4'));

      await user.click(screen.getByRole('button', { name: 'Start' }));

      expect(screen.queryByText('Card 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Card 4')).not.toBeInTheDocument();
    });
    it('should reveal player 2 card when next rounds starts after player 2 win', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));
      await user.click(screen.getByText('A - 1'));

      await user.click(screen.getByRole('button', { name: 'Start' }));

      expect(screen.getByText('Card 4')).toBeInTheDocument();
    });
    it('should hide player 1 card when next rounds starts after player 2 win', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));
      await user.click(screen.getByText('A - 1'));

      await user.click(screen.getByRole('button', { name: 'Start' }));

      expect(screen.queryByText('Card 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Card 3')).not.toBeInTheDocument();
    });
    it('should reveal player 1 card when next rounds starts after draw', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));
      await user.click(screen.getByText('C - 0'));

      await user.click(screen.getByRole('button', { name: 'Start' }));

      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });
    it('should hide player 2 card when next rounds starts after draw', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));
      await user.click(screen.getByText('C - 0'));

      await user.click(screen.getByRole('button', { name: 'Start' }));

      expect(screen.queryByText('Card 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Card 4')).not.toBeInTheDocument();
    });
    it('should show out of cards message player loses all rounds', async () => {
      await user.click(screen.getByRole('button', { name: 'Start' }));
      await user.click(screen.getByText('B - 4'));
      await user.click(screen.getByRole('button', { name: 'Start' }));
      await user.click(screen.getByText('B - 2'));
      await user.click(screen.getByRole('button', { name: 'Start' }));

      expect(screen.getByText('Out of cards')).toBeInTheDocument();
    });
  });
});
