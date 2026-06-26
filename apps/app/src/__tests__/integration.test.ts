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
