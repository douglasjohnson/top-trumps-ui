import { render, screen } from '@testing-library/react';
import DeckEdit from './DeckEdit';
import userEvent, { UserEvent } from '@testing-library/user-event';
import Deck from '../types/Deck';

const input = (name: string) => screen.getByRole('textbox', { name });
const nameInput = () => input('Name');
const imageInput = () => input('Image');

describe('Deck Edit', () => {
  let user: UserEvent;
  let onConfirm: () => void;
  let onCancel: () => void;
  const deck: Deck = {
    name: 'Deck Name',
    imageUrl: 'http://imageurl',
    attributes: [
      { name: 'Att1', units: 'a' },
      { name: 'Att2', units: 'b' },
    ],
    cards: [],
  };
  beforeEach(() => {
    user = userEvent.setup();
    onConfirm = vi.fn();
    onCancel = vi.fn();
  });
  it('should have input for name', () => {
    render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Confirm" />);

    expect(nameInput()).toHaveValue('Deck Name');
  });
  it('should have input for image', () => {
    render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Confirm" />);

    expect(imageInput()).toHaveValue('http://imageurl');
  });
  it('should call onCancel when cancel button is clicked', async () => {
    render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Confirm" />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalled();
  });
  it('should call onConfirm when confirm button is clicked', async () => {
    render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Confirm" />);

    await user.type(nameInput(), ' edited');
    await user.type(imageInput(), '2');
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalledWith({
      name: 'Deck Name edited',
      imageUrl: 'http://imageurl2',
      attributes: [
        { name: 'Att1', units: 'a' },
        { name: 'Att2', units: 'b' },
      ],
      cards: [],
    });
  });
});
