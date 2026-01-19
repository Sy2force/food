import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authAPI } from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
  },
}));

// Mock zustand/middleware to bypass persist completely
vi.mock('zustand/middleware', () => {
  return {
    persist: (config) => (set, get, api) => config(set, get, api),
  };
});

// Import store after mocks
import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state (merge, don't replace to keep methods)
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should login successfully', async () => {
    const mockUser = { _id: '1', name: 'Test User', email: 'test@example.com' };
    const mockToken = 'mock-token';

    authAPI.login.mockResolvedValue({
      data: { user: mockUser, token: mockToken },
    });

    const result = await useAuthStore.getState().login('test@example.com', 'password');

    const state = useAuthStore.getState();
    expect(result.success).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle login failure', async () => {
    const errorMessage = 'Invalid credentials';
    authAPI.login.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const result = await useAuthStore.getState().login('test@example.com', 'wrong');

    const state = useAuthStore.getState();
    expect(result.success).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should logout correctly', () => {
    useAuthStore.setState({
      user: { name: 'User' },
      token: 'token',
      isAuthenticated: true,
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
