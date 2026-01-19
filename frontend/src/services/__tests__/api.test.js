import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';
import { useAuthStore } from '../../store/authStore';

// We need to mock axios or the module itself.
// Since 'api' is the default export which is an axios instance,
// ensuring interceptors are tested is tricky without a dedicated axios mock library or manual spy.
// For simplicity, we will test that the token is attached if present in store.

// Mock the auth store
vi.mock('../../store/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should attach Authorization header if token exists', async () => {
    const token = 'test-token';
    useAuthStore.getState.mockReturnValue({ token });

    // Access the request interceptor
    // Axios instance structure: instance.interceptors.request.handlers[0].fulfilled
    // This is implementation detail reliance, but common for testing interceptors without making real requests

    // Check if handlers exist (might depend on axios version/mock)
    // Alternatively, we can mock the entire axios create and check calls.

    // Let's assume standard axios instance behavior
    const requestInterceptor = api.interceptors.request.handlers[0];
    expect(requestInterceptor).toBeDefined();

    const config = { headers: {} };
    const newConfig = await requestInterceptor.fulfilled(config);

    expect(newConfig.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it('should not attach Authorization header if no token', async () => {
    useAuthStore.getState.mockReturnValue({ token: null });

    const requestInterceptor = api.interceptors.request.handlers[0];
    const config = { headers: {} };
    const newConfig = await requestInterceptor.fulfilled(config);

    expect(newConfig.headers.Authorization).toBeUndefined();
  });
});
