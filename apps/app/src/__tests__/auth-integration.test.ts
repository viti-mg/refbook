import { describe, it, expect } from 'vitest';

describe('Auth Integration', () => {
  describe('Auth Client Configuration', () => {
    it('should export auth client', async () => {
      const { authClient } = await import('../lib/auth-client');
      expect(authClient).toBeDefined();
    });
  });

  describe('Route Protection', () => {
    it('should have beforeLoad protection on competitions route', async () => {
      const competitionsRoute = await import('../routes/competitions');
      expect(competitionsRoute.Route.options.beforeLoad).toBeDefined();
    });

    it('should have beforeLoad protection on competition detail route', async () => {
      const competitionDetailRoute = await import('../routes/competitions.$id');
      expect(competitionDetailRoute.Route.options.beforeLoad).toBeDefined();
    });
  });

  describe('Component Files Exist', () => {
    it('should have SignUp component file', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const componentPath = path.join(process.cwd(), 'src/components/SignUp.tsx');
      expect(fs.existsSync(componentPath)).toBe(true);
    });

    it('should have SignIn component file', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const componentPath = path.join(process.cwd(), 'src/components/SignIn.tsx');
      expect(fs.existsSync(componentPath)).toBe(true);
    });
  });
});