import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MockAdminGuard } from './mock-admin.guard';

function makeContext(authorization?: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers: { authorization } }),
    }),
  } as unknown as ExecutionContext;
}

describe('MockAdminGuard', () => {
  const guard = new MockAdminGuard();
  const originalToken = process.env.ADMIN_MOCK_TOKEN;

  afterEach(() => {
    process.env.ADMIN_MOCK_TOKEN = originalToken;
  });

  it('allows requests with the expected bearer token', () => {
    process.env.ADMIN_MOCK_TOKEN = 'mock-admin-token';

    expect(guard.canActivate(makeContext('Bearer mock-admin-token'))).toBe(
      true,
    );
  });

  it('rejects requests without an authorization header', () => {
    process.env.ADMIN_MOCK_TOKEN = 'mock-admin-token';

    expect(() => guard.canActivate(makeContext())).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects non-bearer authorization schemes', () => {
    process.env.ADMIN_MOCK_TOKEN = 'mock-admin-token';

    expect(() => guard.canActivate(makeContext('Basic dXNlcjpwYXNz'))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects requests when the server token is not configured', () => {
    delete process.env.ADMIN_MOCK_TOKEN;

    expect(() =>
      guard.canActivate(makeContext('Bearer mock-admin-token')),
    ).toThrow(UnauthorizedException);
  });

  it('rejects requests with a wrong token', () => {
    process.env.ADMIN_MOCK_TOKEN = 'mock-admin-token';

    expect(() => guard.canActivate(makeContext('Bearer wrong-token'))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects empty bearer tokens', () => {
    process.env.ADMIN_MOCK_TOKEN = 'mock-admin-token';

    expect(() => guard.canActivate(makeContext('Bearer '))).toThrow(
      UnauthorizedException,
    );
  });
});
