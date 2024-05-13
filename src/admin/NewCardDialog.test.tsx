import { render, screen } from '@testing-library/react';
import NewCardDialog from './NewCardDialog';
import userEvent, { UserEvent } from '@testing-library/user-event';

const input = (name: string) => screen.getByRole('textbox', { name });
const nameInput = () => input('Name');
const descriptionInput = () => input('Description');
const imageInput = () => input('Image');

describe('New Card Dialog', () => {
  let user: UserEvent;
  let onConfirm: () => void;
  let onClose: () => void;
  beforeEach(() => {
    user = userEvent.setup();
    onConfirm = vi.fn();
    onClose = vi.fn();
  });
  it('should be displayed when open', () => {
    render(<NewCardDialog open={true} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('should not be displayed when not open', () => {
    render(<NewCardDialog open={false} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('should have input for name', () => {
    render(<NewCardDialog open={true} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(nameInput()).toBeInTheDocument();
  });
  it('should have input for description', () => {
    render(<NewCardDialog open={true} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(descriptionInput()).toBeInTheDocument();
  });
  it('should have input for image url', () => {
    render(<NewCardDialog open={true} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(imageInput()).toBeInTheDocument();
  });
  it('should have input for each attribute url', () => {
    render(
      <NewCardDialog
        open={true}
        onConfirm={onConfirm}
        onClose={onClose}
        attributes={[
          { name: 'Att1', units: 'a' },
          { name: 'Att2', units: 'b' },
        ]}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Att1' })).toHaveValue('0');
    expect(screen.getByRole('textbox', { name: 'Att2' })).toHaveValue('0');
  });
  it('should call onClose when cancel button is clicked', async () => {
    render(<NewCardDialog open={true} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalled();
  });
  it('should call onConfirm when confirm button is clicked', async () => {
    render(
      <NewCardDialog
        open={true}
        onConfirm={onConfirm}
        onClose={onClose}
        attributes={[
          { name: 'Att1', units: 'a' },
          { name: 'Att2', units: 'b' },
        ]}
      />,
    );

    await user.type(nameInput(), 'Card Name');
    await user.type(descriptionInput(), 'Card description');
    await user.type(imageInput(), 'http://imageurl');
    await user.type(input('Att1'), '1');
    await user.type(input('Att2'), '2');
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalledWith({
      name: 'Card Name',
      description: 'Card description',
      imageUrl: 'http://imageurl',
      attributes: [
        { type: 'Att1', value: 1 },
        { type: 'Att2', value: 2 },
      ],
    });
  }, 10000);
});
