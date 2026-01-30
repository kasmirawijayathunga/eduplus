import { generateTokens } from '@/services/Auth';
import jwt from 'jsonwebtoken';
import config from '@/config/config';

// Mock jsonwebtoken and config
jest.mock('jsonwebtoken');
jest.mock('@/config/config', () => ({
  jwt: {
    secret: 'test-secret',
    accessExpirationMinutes: 30,
    refreshExpirationDays: 7,
  },
}));

// Mock db access if necessary, but generateTokens seems to currently have db call commented out in the source file provided earlier.
// If it is uncommented later, we will need to mock it. Source showed: // await db.users.update(...)

describe('Auth Service', () => {
  describe('generateTokens', () => {
    it('should generate access and refresh tokens for a user', async () => {
      const user = {
        id: 'user-123',
        role: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      const mockSignedToken = 'mock-signed-token';
      (jwt.sign as jest.Mock).mockReturnValue(mockSignedToken);

      const result = await generateTokens(user);

      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual(expect.objectContaining({
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
        access: expect.objectContaining({
          token: mockSignedToken,
        }),
        refresh: expect.objectContaining({
          token: mockSignedToken,
        }),
      }));
    });
  });
});
