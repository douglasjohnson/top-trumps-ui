import { render, screen } from '@testing-library/react';
import CardCard from './CardCard';
import userEvent, { UserEvent } from '@testing-library/user-event';

describe('Card Card', () => {
  let user: UserEvent;
  let onClick: () => void;
  let onDelete: () => void;
  const card = { name: 'Card Name', description: '', imageUrl: 'http://imageurl', attributes: [{ type: 'Att1', value: 10 }] };
  beforeEach(() => {
    user = userEvent.setup();
    onClick = vi.fn();
    onDelete = vi.fn();
  });
  it('should display card name', () => {
    render(<CardCard card={card} onClick={onClick} onDelete={onDelete} />);

    expect(screen.getByText('Card Name')).toBeInTheDocument();
  });
  it('should display card image', () => {
    render(<CardCard card={card} onClick={onClick} onDelete={onDelete} />);

    expect(screen.getByRole('img')).toHaveAttribute('src', card.imageUrl);
  });
  it('should display card attributes', () => {
    render(<CardCard card={card} onClick={onClick} onDelete={onDelete} />);

    expect(screen.getByRole('listitem')).toHaveTextContent('Att1 - 10');
  });
  it('should call onClick when card is clicked', async () => {
    render(<CardCard card={card} onClick={onClick} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'edit card' }));
    expect(onClick).toHaveBeenCalled();
  });
  it('should call onDelete when delete is clicked', async () => {
    render(<CardCard card={card} onClick={onClick} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'delete card' }));

    expect(onDelete).toHaveBeenCalled();
  });
});
