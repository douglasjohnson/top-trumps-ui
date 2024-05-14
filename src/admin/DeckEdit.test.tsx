import { render, screen, within } from '@testing-library/react';
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
  let deck: Deck;
  beforeEach(() => {
    user = userEvent.setup();
    onConfirm = vi.fn();
    onCancel = vi.fn();
    deck = {
      name: 'Deck Name',
      imageUrl: 'http://imageurl',
      attributes: [
        { name: 'Att1', units: 'a' },
        { name: 'Att2', units: 'b' },
      ],
      cards: [],
    };
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
  describe('attributes', () => {
    const attributeListItem = (index = 0) => screen.getAllByRole('textbox', { name: 'Attribute Name' })[index].closest('li') as HTMLLIElement;
    beforeEach(() => {
      render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Confirm" />);
    });
    it('should have button for new attribute', () => {
      expect(screen.getByRole('button', { name: 'New attribute' })).toBeInTheDocument();
    });
    it('should have list item for each attribute', () => {
      const attributeNameInputs = screen.getAllByRole('textbox', { name: 'Attribute Name' });

      expect(attributeNameInputs).toHaveLength(2);
    });
    it('should have input for attribute name', () => {
      expect(within(attributeListItem()).getByRole('textbox', { name: 'Attribute Name' })).toHaveValue('Att1');
    });
    it('should have input for attribute units', () => {
      expect(within(attributeListItem()).getByRole('textbox', { name: 'Attribute Units' })).toHaveValue('a');
    });
    it('should have delete button for attribute', () => {
      expect(within(attributeListItem()).getByRole('button', { name: 'delete attribute' })).toBeInTheDocument();
    });
    it('should add attribute when new attribute button is clicked', async () => {
      await user.click(screen.getByRole('button', { name: 'New attribute' }));

      const attributeNameInputs = screen.getAllByRole('textbox', { name: 'Attribute Name' });

      expect(attributeNameInputs).toHaveLength(3);
      const newAttributeListItem = attributeListItem(2);
      expect(within(newAttributeListItem).getByRole('textbox', { name: 'Attribute Name' })).toHaveValue('');
      expect(within(newAttributeListItem).getByRole('textbox', { name: 'Attribute Units' })).toHaveValue('');
    });
    it('should remove attribute when delete attribute button is clicked', async () => {
      await user.click(within(attributeListItem()).getByRole('button', { name: 'delete attribute' }));

      const attributeNameInputs = screen.getAllByRole('textbox', { name: 'Attribute Name' });
      expect(attributeNameInputs).toHaveLength(1);
      expect(attributeNameInputs[0]).toHaveValue('Att2');
    });
    it('should update attribute name', async () => {
      const attributeNameInput = screen.getAllByRole('textbox', { name: 'Attribute Name' })[0];

      await user.type(attributeNameInput, ' edited');

      expect(attributeNameInput).toHaveValue('Att1 edited');
    });
    it('should update attribute units', async () => {
      const attributeUnitsInput = screen.getAllByRole('textbox', { name: 'Attribute Units' })[0];

      await user.clear(attributeUnitsInput);
      await user.type(attributeUnitsInput, 'c');

      expect(attributeUnitsInput).toHaveValue('c');
    });
  });
});
