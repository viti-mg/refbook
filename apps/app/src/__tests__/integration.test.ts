import { describe, it, expect } from 'vitest'
import { getRouter } from '../router'

describe('Application Structure Integration Tests', () => {
  it('should create router with all expected routes', () => {
    const router = getRouter()

    // Verify router is created
    expect(router).toBeDefined()
  })

  it('should have home route defined', () => {
    const router = getRouter()

    const homeRoute = router.routesById['/']
    expect(homeRoute).toBeDefined()
  })

  it('should have competitions route defined', () => {
    const router = getRouter()

    const competitionsRoute = router.routesById['/competitions']
    expect(competitionsRoute).toBeDefined()
  })

  it('should have competition detail route defined', () => {
    const router = getRouter()

    const competitionDetailRoute = router.routesById['/competitions/$id']
    expect(competitionDetailRoute).toBeDefined()
  })

  it('should have login route defined', () => {
    const router = getRouter()

    const loginRoute = router.routesById['/auth/login']
    expect(loginRoute).toBeDefined()
  })

  it('should have register route defined', () => {
    const router = getRouter()

    const registerRoute = router.routesById['/auth/register']
    expect(registerRoute).toBeDefined()
  })
})

describe('Monorepo Package Integration Tests', () => {
  it('should have @packages/api in dependencies', () => {
    // Verify that the package is configured in package.json
    const pkg = require('../../package.json')
    expect(pkg.dependencies['@packages/api']).toBe('workspace:*')
  })

  it('should have @packages/auth in dependencies', () => {
    // Verify that the package is configured in package.json
    const pkg = require('../../package.json')
    expect(pkg.dependencies['@packages/auth']).toBe('workspace:*')
  })

  it('should have @packages/shared-types in dependencies', () => {
    // Verify that the package is configured in package.json
    const pkg = require('../../package.json')
    expect(pkg.dependencies['@packages/shared-types']).toBe('workspace:*')
  })

  it('should have tRPC client dependencies installed', () => {
    // Verify that tRPC client dependencies are installed
    const pkg = require('../../package.json')
    expect(pkg.dependencies['@trpc/client']).toBeDefined()
    expect(pkg.dependencies['@trpc/react-query']).toBeDefined()
  })

  it('should have TanStack Query installed', () => {
    // Verify that TanStack Query is installed
    const pkg = require('../../package.json')
    expect(pkg.dependencies['@tanstack/react-query']).toBeDefined()
  })
})
