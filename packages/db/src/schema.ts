import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Better Auth tables (managed by Better Auth, defined here for Drizzle)
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: text('email_verified'),
  username: text('username').unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  expiresAt: timestamp('expires_at'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const verificationToken = pgTable('verification_token', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

// Application tables
export const competitions = pgTable('competitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => user.id),
  name: text('name').notNull(),
  sportType: text('sport_type').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  version: serial('version').default(1),
});
