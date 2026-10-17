import { getAdminMockToken, getPort, loadRepoEnv } from './env';

describe('config/env', () => {
  const originalPort = process.env.PORT;
  const originalToken = process.env.ADMIN_MOCK_TOKEN;

  afterEach(() => {
    process.env.PORT = originalPort;
    process.env.ADMIN_MOCK_TOKEN = originalToken;
  });

  describe('getPort', () => {
    it('defaults to 3000 when PORT is not set', () => {
      delete process.env.PORT;

      expect(getPort()).toBe(3000);
    });

    it('defaults to 3000 for non-numeric PORT values', () => {
      process.env.PORT = 'not-a-number';

      expect(getPort()).toBe(3000);
    });

    it('defaults to 3000 for non-positive PORT values', () => {
      process.env.PORT = '0';

      expect(getPort()).toBe(3000);
    });

    it('returns the configured port when valid', () => {
      process.env.PORT = '4000';

      expect(getPort()).toBe(4000);
    });
  });

  describe('getAdminMockToken', () => {
    it('returns the configured token', () => {
      process.env.ADMIN_MOCK_TOKEN = 'secret-token';

      expect(getAdminMockToken()).toBe('secret-token');
    });

    it('returns undefined when not configured', () => {
      delete process.env.ADMIN_MOCK_TOKEN;

      expect(getAdminMockToken()).toBeUndefined();
    });
  });

  describe('loadRepoEnv', () => {
    it('loads without throwing', () => {
      expect(() => loadRepoEnv()).not.toThrow();
    });
  });
});
