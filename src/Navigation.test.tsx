import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import AuthContextProvider from './AuthContextProvider';
import { Navigation } from './Navigation';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

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

describe('Navigation', () => {
  afterEach(() => {
    mocks.GoogleLogin.mockClear();
  });
  describe('not authenticated', () => {
    let onAuthenticationSuccess: () => void;
    beforeEach(() => {
      onAuthenticationSuccess = vi.fn();
      render(
        <MemoryRouter>
          <GoogleOAuthProvider clientId="">
            <AuthContextProvider value={{ authenticated: false, onAuthenticationSuccess }}>
              <Navigation />
            </AuthContextProvider>
          </GoogleOAuthProvider>
        </MemoryRouter>,
      );
    });
    it('should have navigation', () => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
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
    it('should have login button', () => {
      expect(mocks.GoogleLogin).toHaveBeenCalled();
    });
    describe('login', () => {
      afterEach(() => {
        localStorage.clear();
      });
      it('should set token in local storage on success', () => {
        mocks.GoogleLogin.mock.calls[0][0].onSuccess({ credential: 'token-value' });

        expect(localStorage.getItem('token')).toBe('token-value');
      });
      it('should call onAuthenticationSuccess on success', () => {
        mocks.GoogleLogin.mock.calls[0][0].onSuccess({});

        expect(onAuthenticationSuccess).toHaveBeenCalled();
      });
    });
  });
  describe('authenticated', () => {
    beforeEach(() => {
      render(
        <MemoryRouter>
          <GoogleOAuthProvider clientId="">
            <AuthContextProvider value={{ authenticated: true, onAuthenticationSuccess: () => {} }}>
              <Navigation />
            </AuthContextProvider>
          </GoogleOAuthProvider>
        </MemoryRouter>,
      );
    });
    it('should have navigation', () => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
    it('should have home button', () => {
      expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    });
    it('should have build button', () => {
      expect(screen.getByRole('button', { name: 'Build' })).toBeInTheDocument();
    });
    it('should have play button', () => {
      expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    });
    it('should not have login button', () => {
      expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
    });
  });
});
