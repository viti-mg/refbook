import { describe, it, expect } from 'vitest';
import { getRouter } from '../router';
import { readFileSync } from 'fs';
import { join } from 'path';

const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));

describe('Application Structure Integration Tests', () => {
  it('should create router with all expected routes', () => {
    const router = getRouter();

    // Verify router is created
    expect(router).toBeDefined();
  });

  it('should have home route defined', () => {
    const router = getRouter();

    const homeRoute = router.routesById['/'];
    expect(homeRoute).toBeDefined();
  });

  it('should have competitions route defined', () => {
    const router = getRouter();

    const competitionsRoute = router.routesById['/competitions'];
    expect(competitionsRoute).toBeDefined();
  });

  it('should have competition detail route defined', () => {
    const router = getRouter();

    const competitionDetailRoute = router.routesById['/competitions/$id'];
    expect(competitionDetailRoute).toBeDefined();
  });

  it('should have login route defined', () => {
    const router = getRouter();

    const loginRoute = router.routesById['/auth/login'];
    expect(loginRoute).toBeDefined();
  });

  it('should have register route defined', () => {
    const router = getRouter();

    const registerRoute = router.routesById['/auth/register'];
    expect(registerRoute).toBeDefined();
  });
});

describe('Monorepo Package Integration Tests', () => {
  it('should have @packages/api in dependencies', () => {
    // Verify that the package is configured in package.json
    expect(packageJson.dependencies['@packages/api']).toBe('workspace:*');
  });

  it('should have @packages/auth in dependencies', () => {
    // Verify that the package is configured in package.json
    expect(packageJson.dependencies['@packages/auth']).toBe('workspace:*');
  });

  it('should have @packages/types in dependencies', () => {
    // Verify that the package is configured in package.json
    expect(packageJson.dependencies['@packages/types']).toBe('workspace:*');
  });

  it('should have tRPC client dependencies installed', () => {
    // Verify that tRPC client dependencies are now in @packages/api
    const apiPackageJson = JSON.parse(readFileSync(join(__dirname, '../../../../packages/api/package.json'), 'utf-8'));
    expect(apiPackageJson.dependencies['@trpc/client']).toBeDefined();
    expect(apiPackageJson.dependencies['@trpc/react-query']).toBeDefined();
  });

  it('should have TanStack Query installed', () => {
    // Verify that TanStack Query is installed
    expect(packageJson.dependencies['@tanstack/react-query']).toBeDefined();
  });
});
