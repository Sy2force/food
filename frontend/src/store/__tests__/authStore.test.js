import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../authStore';
import { authAPI } from '../../services/api';

// Mock the API calls
vi.mock('../../services/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      loading: false,
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
    const mockUser = { _id: '1', name: 'Test User', email: 'test@test.com' };
    const mockToken = 'fake-token';
    authAPI.login.mockResolvedValue({ data: { user: mockUser, token: mockToken } });

    const result = await useAuthStore.getState().login('test@test.com', 'password');

    expect(result.success).toBe(true);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle login failure', async () => {
    const errorMessage = 'Invalid credentials';
    authAPI.login.mockRejectedValue({ response: { data: { message: errorMessage } } });

    const result = await useAuthStore.getState().login('test@test.com', 'wrongpassword');

    expect(result.success).toBe(false);
    expect(result.error).toBe(errorMessage);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should logout correctly', () => {
    // Set initial logged in state
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
