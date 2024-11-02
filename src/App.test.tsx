import { act, render, screen, within } from '@testing-library/react';
import App from './App';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { findAll } from './service/DeckService';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { afterEach, beforeEach } from 'vitest';
import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

const mocks = vi.hoisted(() => {
  return {
    GoogleLogin: vi.fn(),
  };
});

vi.mock('@react-oauth/google', async (importOriginal) => {
  const original: object = await importOriginal();
  return {
    ...original,
    GoogleLogin: mocks.GoogleLogin,
  };
});
vi.mock('./service/DeckService');

const mockedFindAll = vi.mocked(findAll);

const navigation = () => screen.getByRole('navigation');
const main = () => screen.getByRole('main');

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <GoogleOAuthProvider clientId={''}>
      <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
    </GoogleOAuthProvider>
  </MemoryRouter>
);

describe('App', () => {
  let user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
    mockedFindAll.mockResolvedValue([{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }]);
  });
  afterEach(() => {
    mocks.GoogleLogin.mockClear();
  });
  describe('not authenticated', () => {
    beforeEach(() => {
      render(<App />, { wrapper: Wrapper });
    });
    it('should not have home button', () => {
      expect(screen.queryByRole('button', { name: 'Home' })).not.toBeInTheDocument();
    });
    it('should not have build button', () => {
      expect(screen.queryByRole('button', { name: 'Build' })).not.toBeInTheDocument();
    });
    it('should not have play button', () => {
      expect(screen.queryByRole('button', { name: 'Play' })).not.toBeInTheDocument();
    });
  });
  describe('authenticated', () => {
    beforeEach(async () => {
      render(<App />, { wrapper: Wrapper });
      await act(async () => {
        mocks.GoogleLogin.mock.calls[0][0].onSuccess({});
      });
    });
    describe('home', () => {
      it('should default to home', () => {
        expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
      });
      it('should have link for build', () => {
        expect(within(main()).getByRole('link', { name: 'build' })).toBeInTheDocument();
      });
      it('should have link for play', () => {
        expect(within(main()).getByRole('link', { name: 'play' })).toBeInTheDocument();
      });
      it('should navigate to build when build link is clicked', async () => {
        await user.click(within(main()).getByRole('link', { name: 'build' }));

        expect(screen.getByRole('heading', { name: 'Build' })).toBeInTheDocument();
        expect(await screen.findByText('Deck 1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument();
      });
      it('should navigate to play when play link is clicked', async () => {
        await user.click(within(main()).getByRole('link', { name: 'play' }));

        expect(screen.getByRole('heading', { name: 'Play' })).toBeInTheDocument();
        expect(await screen.findByText('Deck 1')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'delete' })).not.toBeInTheDocument();
      });
    });
    describe('navigation', () => {
      it('should navigate to build when build button is clicked', async () => {
        await user.click(within(navigation()).getByRole('button', { name: 'Build' }));

        expect(screen.getByRole('heading', { name: 'Build' })).toBeInTheDocument();
        expect(await screen.findByText('Deck 1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument();
      });
      it('should navigate to play when play button is clicked', async () => {
        await user.click(within(navigation()).getByRole('button', { name: 'Play' }));

        expect(screen.getByRole('heading', { name: 'Play' })).toBeInTheDocument();
        expect(await screen.findByText('Deck 1')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'delete' })).not.toBeInTheDocument();
      });
    });
    describe('loading indicator', () => {
      it('should show loading indicator when build is loading', async () => {
        mockedFindAll.mockClear();
        mockedFindAll.mockImplementation(() => new Promise(vi.fn()));

        await user.click(within(main()).getByRole('link', { name: 'build' }));

        expect(screen.getByRole('heading', { name: 'Build' })).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
      it('should show loading indicator when play is loading', async () => {
        mockedFindAll.mockImplementation(() => new Promise(vi.fn()));

        await user.click(within(main()).getByRole('link', { name: 'play' }));

        expect(screen.getByRole('heading', { name: 'Play' })).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    });
  });
});
