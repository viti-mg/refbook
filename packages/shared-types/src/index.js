import { z } from 'zod';
export const CompetitionSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    name: z.string(),
    sportType: z.enum(['football', 'athletics']),
    status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
    createdAt: z.date(),
    updatedAt: z.date(),
    version: z.number(),
});
