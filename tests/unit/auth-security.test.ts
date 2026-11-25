import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginRateLimit,
  hasPermission,
  hasAnyRole,
} from '@/lib/auth/session';

describe('Authentication & Security RBAC Suite', () => {
  it('hashes and verifies passwords securely using bcrypt', async () => {
    const raw = 'SuperSecretPassword@2026';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    expect(hash.startsWith('$2')).toBe(true);

    const isValid = await verifyPassword(raw, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword('WrongPassword', hash);
    expect(isInvalid).toBe(false);
  });

  it('enforces rate limiting on repeated failed login attempts from same IP', () => {
    const testIp = '192.168.10.99';
    clearLoginRateLimit(testIp);

    // Initial attempt allowed
    const check1 = checkLoginRateLimit(testIp);
    expect(check1.allowed).toBe(true);

    // Simulate 5 failures
    for (let i = 0; i < 5; i++) {
      recordFailedLogin(testIp);
    }

    const checkBlocked = checkLoginRateLimit(testIp);
    expect(checkBlocked.allowed).toBe(false);
    expect(checkBlocked.remainingAttempts).toBe(0);

    // Clean up
    clearLoginRateLimit(testIp);
    expect(checkLoginRateLimit(testIp).allowed).toBe(true);
  });

  it('correctly verifies SUPER_ADMIN wildcard permissions', () => {
    const superAdminUser = {
      id: 'usr-1',
      role: { name: 'SUPER_ADMIN', permissions: [] },
    };

    expect(hasPermission(superAdminUser, 'article:create')).toBe(true);
    expect(hasPermission(superAdminUser, 'user:delete')).toBe(true);
    expect(hasAnyRole(superAdminUser, ['SUPER_ADMIN', 'ADMIN'])).toBe(true);
  });

  it('respects assigned role permissions for regular roles', () => {
    const editorUser = {
      id: 'usr-2',
      role: {
        name: 'EDITOR',
        permissions: [
          { permission: { name: 'article:create' } },
          { permission: { name: 'article:publish' } },
        ],
      },
    };

    expect(hasPermission(editorUser, 'article:create')).toBe(true);
    expect(hasPermission(editorUser, 'article:publish')).toBe(true);
    expect(hasPermission(editorUser, 'user:manage')).toBe(false);
  });
});
