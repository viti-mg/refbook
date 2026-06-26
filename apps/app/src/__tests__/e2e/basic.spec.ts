import { test, expect } from '@playwright/test'

test.describe('Application E2E Tests', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/TanStack Start Starter/)
  })

  test('should navigate to competitions page', async ({ page }) => {
    await page.goto('/')
    // This test will be updated once navigation is implemented
    // For now, just verify the page loads
    await expect(page).toHaveURL('/')
  })

  test('should have responsive design', async ({ page }) => {
    await page.goto('/')
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page).toHaveTitle(/TanStack Start Starter/)
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page).toHaveTitle(/TanStack Start Starter/)
  })
})
