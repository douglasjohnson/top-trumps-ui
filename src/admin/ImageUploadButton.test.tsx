import ImageUploadButton from './ImageUploadButton';
import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { afterEach, beforeEach } from 'vitest';
import { BatchItem, useItemFinishListener } from '@rpldy/uploady';

const mockedUseItemFinishListener = vi.mocked(useItemFinishListener);

vi.mock('@rpldy/uploady', async (importOriginal) => {
  const original: object = await importOriginal();
  return {
    ...original,
    useItemFinishListener: vi.fn(),
  };
});

const input = () => document.querySelector('input') as HTMLInputElement;

describe('Image Upload button', () => {
  let user: UserEvent;
  let onItemFinish: (url: string) => void;
  beforeEach(() => {
    user = userEvent.setup();
    onItemFinish = vi.fn();
    render(<ImageUploadButton onItemFinish={onItemFinish} />);
  });
  afterEach(() => {
    mockedUseItemFinishListener.mockClear();
  });
  it('should show button', () => {
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  });
  it('should have hidden file input', () => {
    const inputElement = input();
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'file');
  });
  it('should accept image files', async () => {
    const file = new File(['image'], 'image.png', { type: 'image/png' });
    const inputElement = input();

    await user.upload(inputElement, file);

    const uploadedFile = inputElement.files ? inputElement.files[0] : null;
    expect(uploadedFile).toBe(file);
  });
  it('should not accept non image files', async () => {
    const file = new File(['text'], 'text.html', { type: 'text/html' });
    const inputElement = input();

    await user.upload(inputElement, file);

    expect(inputElement.files).toHaveLength(0);
  });
  it('should call onItemFinish callback', async () => {
    mockedUseItemFinishListener.mock.calls[0][0](
      {
        uploadResponse: { data: { url: 'http://imageurl' } },
      } as BatchItem,
      {},
    );

    expect(onItemFinish).toHaveBeenCalledWith('http://imageurl');
  });
});
