import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    username: text('username').notNull().unique(),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
export const competitions = pgTable('competitions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    sportType: text('sport_type').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    version: serial('version').default(1),
});
