import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

describe('Build System Configuration', () => {
  const packageJson = JSON.parse(
    readFileSync(join(__dirname, '../../package.json'), 'utf-8')
  )

  describe('Build Scripts', () => {
    it('should have build script', () => {
      expect(packageJson.scripts.build).toBeDefined()
      expect(packageJson.scripts.build).toBe('vite build')
    })

    it('should have lint script', () => {
      expect(packageJson.scripts.lint).toBeDefined()
      expect(packageJson.scripts.lint).toBe('eslint . --ext .ts,.tsx')
    })

    it('should have lint:fix script', () => {
      expect(packageJson.scripts['lint:fix']).toBeDefined()
      expect(packageJson.scripts['lint:fix']).toBe('eslint . --ext .ts,.tsx --fix')
    })

    it('should have format script', () => {
      expect(packageJson.scripts.format).toBeDefined()
      expect(packageJson.scripts.format).toBe('prettier --write .')
    })

    it('should have format:check script', () => {
      expect(packageJson.scripts['format:check']).toBeDefined()
      expect(packageJson.scripts['format:check']).toBe('prettier --check .')
    })

    it('should have type-check script', () => {
      expect(packageJson.scripts['type-check']).toBeDefined()
      expect(packageJson.scripts['type-check']).toBe('tsc --noEmit')
    })

    it('should have clean script', () => {
      expect(packageJson.scripts.clean).toBeDefined()
      expect(packageJson.scripts.clean).toBe('rm -rf .vinxi dist node_modules/.vite')
    })
  })

  describe('ESLint Configuration', () => {
    it('should have eslint.config.js file', () => {
      expect(existsSync(join(__dirname, '../../eslint.config.js'))).toBe(true)
    })

    it('should have eslint dependencies', () => {
      expect(packageJson.devDependencies['eslint']).toBeDefined()
      expect(packageJson.devDependencies['typescript-eslint']).toBeDefined()
      expect(packageJson.devDependencies['@eslint/js']).toBeDefined()
    })
  })

  describe('Prettier Configuration', () => {
    it('should have prettier.config.js file', () => {
      expect(existsSync(join(__dirname, '../../prettier.config.js'))).toBe(true)
    })

    it('should have prettier dependency', () => {
      expect(packageJson.devDependencies['prettier']).toBeDefined()
    })
  })

  describe('TypeScript Configuration', () => {
    it('should have tsconfig.json file', () => {
      expect(existsSync(join(__dirname, '../../tsconfig.json'))).toBe(true)
    })

    it('should have typescript dependency', () => {
      expect(packageJson.devDependencies['typescript']).toBeDefined()
    })

    it('should have vitest globals in types', () => {
      // Vitest globals are configured in vitest.config.ts with globals: true
      // This test verifies the vitest configuration exists
      const vitestConfig = readFileSync(
        join(__dirname, '../../vitest.config.ts'),
        'utf-8'
      )
      expect(vitestConfig).toContain('globals')
    })
  })

  describe('Turborepo Integration', () => {
    it('should have scripts that match turborepo pipeline', () => {
      expect(packageJson.scripts.build).toBeDefined()
      expect(packageJson.scripts.lint).toBeDefined()
      expect(packageJson.scripts.test).toBeDefined()
      expect(packageJson.scripts['type-check']).toBeDefined()
    })
  })
})

describe('Docker Configuration', () => {
  describe('Dockerfile', () => {
    it('should have Dockerfile', () => {
      expect(existsSync(join(__dirname, '../../Dockerfile'))).toBe(true)
    })

    it('should contain build stage', () => {
      const dockerfile = readFileSync(join(__dirname, '../../Dockerfile'), 'utf-8')
      expect(dockerfile).toContain('FROM node:18-alpine AS builder')
    })

    it('should contain production stage', () => {
      const dockerfile = readFileSync(join(__dirname, '../../Dockerfile'), 'utf-8')
      expect(dockerfile).toContain('FROM node:18-alpine AS runner')
    })

    it('should expose port 3000', () => {
      const dockerfile = readFileSync(join(__dirname, '../../Dockerfile'), 'utf-8')
      expect(dockerfile).toContain('EXPOSE 3000')
    })

    it('should set NODE_ENV to production', () => {
      const dockerfile = readFileSync(join(__dirname, '../../Dockerfile'), 'utf-8')
      expect(dockerfile).toContain('ENV NODE_ENV=production')
    })
  })

  describe('Docker Compose', () => {
    it('should have docker-compose.yml file', () => {
      expect(existsSync(join(__dirname, '../../docker-compose.yml'))).toBe(true)
    })

    it('should define app service', () => {
      const dockerCompose = readFileSync(
        join(__dirname, '../../docker-compose.yml'),
        'utf-8'
      )
      expect(dockerCompose).toContain('app:')
    })

    it('should define postgres service', () => {
      const dockerCompose = readFileSync(
        join(__dirname, '../../docker-compose.yml'),
        'utf-8'
      )
      expect(dockerCompose).toContain('postgres:')
    })

    it('should map port 3000 for app', () => {
      const dockerCompose = readFileSync(
        join(__dirname, '../../docker-compose.yml'),
        'utf-8'
      )
      expect(dockerCompose).toContain('3000:3000')
    })
  })

  describe('Docker Ignore', () => {
    it('should have .dockerignore file', () => {
      expect(existsSync(join(__dirname, '../../.dockerignore'))).toBe(true)
    })

    it('should ignore node_modules', () => {
      const dockerIgnore = readFileSync(
        join(__dirname, '../../.dockerignore'),
        'utf-8'
      )
      expect(dockerIgnore).toContain('node_modules')
    })

    it('should ignore .env files', () => {
      const dockerIgnore = readFileSync(
        join(__dirname, '../../.dockerignore'),
        'utf-8'
      )
      expect(dockerIgnore).toContain('.env')
    })
  })
})
