import { render, screen, within } from '@testing-library/react';
import DeckEdit from './DeckEdit';
import userEvent, { UserEvent } from '@testing-library/user-event';
import Deck from '../types/Deck';
import Card from '../types/Card';

const input = (name: string) => screen.getByRole('textbox', { name });
const nameInput = () => input('Name');
const imageInput = () => input('Image');

const attributeListItem = (index = 0) => screen.getAllByRole('textbox', { name: 'Attribute Name' })[index].closest('li') as HTMLLIElement;

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
      attributes: [],
      cards: [],
    };
  });
  it('should have input for name', () => {
    render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Update" />);

    expect(nameInput()).toHaveValue('Deck Name');
  });
  it('should have input for image', () => {
    render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Update" />);

    expect(imageInput()).toHaveValue('http://imageurl');
  });
  it('should call onCancel when cancel button is clicked', async () => {
    render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Update" />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalled();
  });
  it('should call onConfirm when confirm button is clicked', async () => {
    render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Update" />);

    await user.type(nameInput(), ' edited');
    await user.type(imageInput(), '2');
    await user.click(screen.getByRole('button', { name: 'Update' }));

    expect(onConfirm).toHaveBeenCalledWith({
      name: 'Deck Name edited',
      imageUrl: 'http://imageurl2',
      attributes: [],
      cards: [],
    });
  });
  describe('attributes', () => {
    beforeEach(() => {
      deck.attributes = [
        { name: 'Att1', units: 'a' },
        { name: 'Att2', units: 'b' },
      ];
      render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Update" />);
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
  describe('cards', () => {
    const cardCard = (name: string) => screen.getByText(name).closest('.MuiCard-root') as HTMLElement;
    beforeEach(() => {
      deck.attributes = [
        { name: 'Att1', units: 'a' },
        { name: 'Att2', units: 'b' },
      ];
      deck.cards = [
        {
          name: 'Card 1',
          description: 'Card 1 description',
          imageUrl: 'http://imageurl1',
          attributes: [
            {
              type: 'Att1',
              value: 1,
            },
            { type: 'Att2', value: 2 },
          ],
        },
        {
          name: 'Card 2',
          description: 'Card 2 description',
          imageUrl: 'http://imageurl2',
          attributes: [
            {
              type: 'Att1',
              value: 21,
            },
            { type: 'Att2', value: 22 },
          ],
        },
      ];
      render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Update" />);
    });
    it('should display all cards', () => {
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });
    describe('new', () => {
      it('should have button for new card', () => {
        expect(screen.getByRole('button', { name: 'new' })).toBeInTheDocument();
      });
      it('should show new card dialog when new card button is clicked', async () => {
        await user.click(screen.getByRole('button', { name: 'new' }));

        const newCardDialog = screen.getByRole('dialog');
        expect(newCardDialog).toBeInTheDocument();
        expect(within(newCardDialog).getByRole('textbox', { name: 'Name' })).toHaveValue('');
      });
      it('should hide new card dialog on cancel', async () => {
        await user.click(screen.getByRole('button', { name: 'new' }));

        await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }));

        expect(screen.queryByRole('dialog')).not.toBeVisible();
      });
      it('should hide new card dialog on confirm', async () => {
        await user.click(screen.getByRole('button', { name: 'new' }));

        await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }));

        expect(screen.queryByRole('dialog')).not.toBeVisible();
      });
      it('should update cards on confirm', async () => {
        await user.click(screen.getByRole('button', { name: 'new' }));

        const newCardDialog = screen.getByRole('dialog');
        await user.type(within(newCardDialog).getByRole('textbox', { name: 'Name' }), 'Card 3');
        await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }));

        expect(screen.getByText('Card 3')).toBeInTheDocument();
      });
    });
    describe('edit', () => {
      it('should have button for edit card', async () => {
        expect(within(cardCard('Card 1')).getByRole('button', { name: 'edit card' })).toBeInTheDocument();
      });
      it('should show edit card dialog when edit card button is clicked', async () => {
        await user.click(within(cardCard('Card 1')).getByRole('button', { name: 'edit card' }));

        const editCardDialog = screen.getByRole('dialog');
        expect(editCardDialog).toBeInTheDocument();
        expect(within(editCardDialog).getByRole('textbox', { name: 'Name' })).toHaveValue('Card 1');
      });
      it('should hide edit card dialog on cancel', async () => {
        await user.click(within(cardCard('Card 1')).getByRole('button', { name: 'edit card' }));

        await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      it('should hide edit card dialog on confirm', async () => {
        await user.click(within(cardCard('Card 1')).getByRole('button', { name: 'edit card' }));

        await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      it('should update cards on confirm', async () => {
        await user.click(within(cardCard('Card 1')).getByRole('button', { name: 'edit card' }));

        const editCardDialog = screen.getByRole('dialog');
        await user.type(within(editCardDialog).getByRole('textbox', { name: 'Name' }), ' edited');
        await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }));

        expect(screen.getByText('Card 1 edited')).toBeInTheDocument();
      });
    });
    it('should delete card when delete button is clicked', async () => {
      await user.click(within(cardCard('Card 1')).getByRole('button', { name: 'delete card' }));

      expect(screen.queryByText('Card 1')).not.toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });
  });
  describe('card attributes', () => {
    let card: Card;
    beforeEach(() => {
      card = {
        name: 'Card 1',
        description: 'Card 1 description',
        imageUrl: 'http://imageurl1',
        attributes: [
          {
            type: 'Att1',
            value: 1,
          },
          { type: 'Att2', value: 2 },
        ],
      };
      deck.attributes = [
        { name: 'Att1', units: 'a' },
        { name: 'Att2', units: 'b' },
      ];
      deck.cards = [card];

      render(<DeckEdit deck={deck} onConfirm={onConfirm} onCancel={onCancel} confirmText="Update" />);
    });
    it('should update cards when attribute name changed', async () => {
      await user.type(screen.getAllByRole('textbox', { name: 'Attribute Name' })[0], ' edited');
      await user.click(screen.getByRole('button', { name: 'Update' }));

      expect(onConfirm).toHaveBeenCalledWith({
        ...deck,
        attributes: [
          { name: 'Att1 edited', units: 'a' },
          { name: 'Att2', units: 'b' },
        ],
        cards: [
          {
            ...card,
            attributes: [
              {
                type: 'Att1 edited',
                value: 1,
              },
              { type: 'Att2', value: 2 },
            ],
          },
        ],
      });
    });
    it('should update cards when attribute added', async () => {
      await user.click(screen.getByRole('button', { name: 'New attribute' }));

      const newAttributeListItem = attributeListItem(2);
      await user.type(within(newAttributeListItem).getByRole('textbox', { name: 'Attribute Name' }), 'Att3');
      await user.type(within(newAttributeListItem).getByRole('textbox', { name: 'Attribute Units' }), 'c');

      await user.click(screen.getByRole('button', { name: 'Update' }));

      expect(onConfirm).toHaveBeenCalledWith({
        ...deck,
        attributes: [...deck.attributes, { name: 'Att3', units: 'c' }],
        cards: [
          {
            ...card,
            attributes: [...card.attributes, { type: 'Att3', value: 0 }],
          },
        ],
      });
    });
    it('should update cards when attribute removed', async () => {
      await user.click(within(attributeListItem()).getByRole('button', { name: 'delete attribute' }));

      await user.click(screen.getByRole('button', { name: 'Update' }));

      expect(onConfirm).toHaveBeenCalledWith({
        ...deck,
        attributes: [{ name: 'Att2', units: 'b' }],
        cards: [
          {
            ...card,
            attributes: [{ type: 'Att2', value: 2 }],
          },
        ],
      });
    });
  });
});
