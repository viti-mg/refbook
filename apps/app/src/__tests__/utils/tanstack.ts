import { render, RenderOptions } from '@testing-library/react'
import { getRouter } from '../../router'

/**
 * Testing utilities for TanStack Start features
 */

/**
 * Render a component with TanStack Router context
 * This is useful for testing components that use router hooks
 */
export function renderWithRouter(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // For now, just use standard render
  // In the future, this could be enhanced to provide router context
  return render(ui, options)
}

/**
 * Get the router instance for testing routing functionality
 */
export function getTestRouter() {
  return getRouter()
}

/**
 * Helper to test server function responses
 * This will be used when server functions are implemented
 */
export async function expectServerFunction<T>(
  fn: () => Promise<T>,
  expected: T
) {
  const result = await fn()
  expect(result).toEqual(expected)
}

/**
 * Helper to test server function errors
 */
export async function expectServerFunctionError(
  fn: () => Promise<any>,
  errorMessage: string
) {
  await expect(fn).rejects.toThrow(errorMessage)
}

/**
 * Mock server function for testing
 * Use this when you need to mock server function calls in component tests
 */
export function mockServerFunction<T>(mockImplementation: T) {
  return mockImplementation
}
