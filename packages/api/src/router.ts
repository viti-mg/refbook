import { initTRPC } from '@trpc/server';
import * as z from 'zod';
import { auth } from '@packages/auth';
import { db, competitions } from '@packages/db';
import { eq, and, desc, like, or, gte, lte } from 'drizzle-orm';

// Template data (copied from apps/app/src/templates/)
const footballTemplate = {
  card_types: [
    {
      id: "yellow",
      name: "Yellow Card",
      color: "#FFFF00",
      display_duration: 5000
    },
    {
      id: "red",
      name: "Red Card",
      color: "#FF0000",
      display_duration: 10000
    }
  ],
  match_structure: {
    type: "halves",
    duration: 90,
    halves: 2,
    allow_extra_time: true
  },
  action_types: [
    {
      id: "goal",
      name: "Goal",
      fields: [
        {
          name: "scorer_id",
          label: "Scorer",
          description: "Player who scored the goal",
          placeholder: "Enter player name or ID",
          type: "text",
          required: true
        },
        {
          name: "assistant_id",
          label: "Assistant Referee",
          description: "Assistant referee who signaled the goal",
          placeholder: "Enter assistant referee name",
          type: "text",
          required: false
        },
        {
          name: "minute",
          label: "Minute",
          description: "When the goal was scored",
          type: "number",
          required: true
        },
        {
          name: "team",
          label: "Team",
          description: "Which team scored",
          placeholder: "Home or Away",
          type: "text",
          required: true
        }
      ]
    },
    {
      id: "substitution",
      name: "Substitution",
      fields: [
        {
          name: "player_out",
          label: "Player Out",
          description: "Player being substituted",
          placeholder: "Enter player name",
          type: "text",
          required: true
        },
        {
          name: "player_in",
          label: "Player In",
          description: "Player entering the match",
          placeholder: "Enter player name",
          type: "text",
          required: true
        },
        {
          name: "minute",
          label: "Minute",
          description: "When the substitution occurred",
          type: "number",
          required: true
        }
      ]
    },
    {
      id: "card_log",
      name: "Card Logged",
      fields: [
        {
          name: "card_id",
          label: "Card",
          description: "Reference to the card that was shown",
          placeholder: "Select card",
          type: "text",
          required: true
        },
        {
          name: "minute",
          label: "Minute",
          description: "When the card was shown",
          type: "number",
          required: true
        }
      ]
    }
  ]
};

const athleticsTemplate = {
  card_types: [
    {
      id: "yellow",
      name: "Yellow Card",
      color: "#FFFF00",
      display_duration: 5000
    },
    {
      id: "red",
      name: "Red Card",
      color: "#FF0000",
      display_duration: 10000
    }
  ],
  match_structure: {
    type: "events",
    disciplines: ["track", "field"]
  },
  action_types: [
    {
      id: "false_start",
      name: "False Start",
      fields: [
        {
          name: "athlete_id",
          label: "Athlete",
          description: "Athlete who false started",
          placeholder: "Enter athlete name or ID",
          type: "text",
          required: true
        },
        {
          name: "lane_number",
          label: "Lane Number",
          description: "Lane where the false start occurred",
          placeholder: "Enter lane number",
          type: "number",
          required: true
        },
        {
          name: "heat_number",
          label: "Heat Number",
          description: "Heat number",
          placeholder: "Enter heat number",
          type: "number",
          required: false
        },
        {
          name: "notes",
          label: "Notes",
          description: "Additional notes about the false start",
          placeholder: "Enter any additional notes",
          type: "text",
          required: false
        }
      ]
    },
    {
      id: "lane_infringement",
      name: "Lane Infringement",
      fields: [
        {
          name: "athlete_id",
          label: "Athlete",
          description: "Athlete who committed the infringement",
          placeholder: "Enter athlete name or ID",
          type: "text",
          required: true
        },
        {
          name: "lane_number",
          label: "Lane Number",
          description: "Lane where the infringement occurred",
          placeholder: "Enter lane number",
          type: "number",
          required: true
        },
        {
          name: "infringement_type",
          label: "Infringement Type",
          description: "Type of lane infringement",
          placeholder: "e.g., stepping out of lane, impeding another athlete",
          type: "text",
          required: true
        },
        {
          name: "event_stage",
          label: "Event Stage",
          description: "Stage of the event",
          placeholder: "e.g., heat, semi-final, final",
          type: "text",
          required: false
        }
      ]
    }
  ]
};

const t = initTRPC.create();

// Zod schemas for input validation
const competitionFilterSchema = z.object({
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
  sportType: z.enum(['football', 'athletics']).optional(),
  dateRange: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
  search: z.string().optional(),
});

const competitionCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sportType: z.enum(['football', 'athletics']),
  templateType: z.enum(['football', 'athletics']),
  scheduledStart: z.string().min(1, 'Scheduled start is required'),
  location: z.string().optional(),
  notes: z.string().optional(),
});

const competitionUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

const competitionUpdateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
});

const competitionDeleteSchema = z.object({
  id: z.string().uuid(),
});

const competitionGetSchema = z.object({
  id: z.string().uuid(),
});

// Helper function to get current user from session
async function getCurrentUser() {
  const session = await auth.api.getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

// Template data
const templates = {
  football: footballTemplate,
  athletics: athleticsTemplate,
};

export const router = t.router({
  competitions: t.router({
    list: t.procedure
      .input(competitionFilterSchema.optional())
      .query(async ({ input }) => {
        const currentUser = await getCurrentUser();
        
        let query = db
          .select()
          .from(competitions)
          .where(eq(competitions.userId, currentUser.id))
          .orderBy(desc(competitions.scheduledStart));

        // Apply filters
        if (input?.status) {
          query = query.where(and(
            eq(competitions.userId, currentUser.id),
            eq(competitions.status, input.status)
          ));
        }

        if (input?.sportType) {
          query = query.where(and(
            eq(competitions.userId, currentUser.id),
            eq(competitions.sportType, input.sportType)
          ));
        }

        if (input?.dateRange?.start) {
          query = query.where(and(
            eq(competitions.userId, currentUser.id),
            gte(competitions.scheduledStart, new Date(input.dateRange.start))
          ));
        }

        if (input?.dateRange?.end) {
          query = query.where(and(
            eq(competitions.userId, currentUser.id),
            lte(competitions.scheduledStart, new Date(input.dateRange.end))
          ));
        }

        if (input?.search) {
          query = query.where(and(
            eq(competitions.userId, currentUser.id),
            or(
              like(competitions.name, `%${input.search}%`),
              like(competitions.location, `%${input.search}%`)
            )
          ));
        }

        return await query;
      }),
    get: t.procedure
      .input(competitionGetSchema)
      .query(async ({ input }) => {
        const currentUser = await getCurrentUser();
        
        const competition = await db
          .select()
          .from(competitions)
          .where(and(
            eq(competitions.id, input.id),
            eq(competitions.userId, currentUser.id)
          ))
          .limit(1);

        if (!competition[0]) {
          throw new Error('Competition not found');
        }

        return competition[0];
      }),
    getTemplates: t.procedure
      .query(() => {
        return {
          football: templates.football,
          athletics: templates.athletics,
        };
      }),
    create: t.procedure
      .input(competitionCreateSchema)
      .mutation(async ({ input }) => {
        const currentUser = await getCurrentUser();
        
        const template = templates[input.templateType];
        if (!template) {
          throw new Error('Template not found');
        }

        const newCompetition = await db
          .insert(competitions)
          .values({
            userId: currentUser.id,
            name: input.name,
            sportType: input.sportType,
            status: 'scheduled',
            scheduledStart: new Date(input.scheduledStart),
            location: input.location || null,
            notes: input.notes || null,
          })
          .returning();

        return {
          ...newCompetition[0],
          template,
        };
      }),
    update: t.procedure
      .input(competitionUpdateSchema)
      .mutation(async ({ input }) => {
        const currentUser = await getCurrentUser();
        
        const existing = await db
          .select()
          .from(competitions)
          .where(and(
            eq(competitions.id, input.id),
            eq(competitions.userId, currentUser.id)
          ))
          .limit(1);

        if (!existing[0]) {
          throw new Error('Competition not found');
        }

        const updated = await db
          .update(competitions)
          .set({
            ...(input.name && { name: input.name }),
            ...(input.location !== undefined && { location: input.location || null }),
            ...(input.notes !== undefined && { notes: input.notes || null }),
            updatedAt: new Date(),
          })
          .where(and(
            eq(competitions.id, input.id),
            eq(competitions.userId, currentUser.id)
          ))
          .returning();

        return updated[0];
      }),
    updateStatus: t.procedure
      .input(competitionUpdateStatusSchema)
      .mutation(async ({ input }) => {
        const currentUser = await getCurrentUser();
        
        const existing = await db
          .select()
          .from(competitions)
          .where(and(
            eq(competitions.id, input.id),
            eq(competitions.userId, currentUser.id)
          ))
          .limit(1);

        if (!existing[0]) {
          throw new Error('Competition not found');
        }

        // Update actual start/end times based on status
        const updates: any = {
          status: input.status,
          updatedAt: new Date(),
        };

        if (input.status === 'in_progress' && !existing[0].actualStart) {
          updates.actualStart = new Date();
        }

        if (input.status === 'completed' && !existing[0].actualEnd) {
          updates.actualEnd = new Date();
        }

        const updated = await db
          .update(competitions)
          .set(updates)
          .where(and(
            eq(competitions.id, input.id),
            eq(competitions.userId, currentUser.id)
          ))
          .returning();

        return updated[0];
      }),
    delete: t.procedure
      .input(competitionDeleteSchema)
      .mutation(async ({ input }) => {
        const currentUser = await getCurrentUser();
        
        const existing = await db
          .select()
          .from(competitions)
          .where(and(
            eq(competitions.id, input.id),
            eq(competitions.userId, currentUser.id)
          ))
          .limit(1);

        if (!existing[0]) {
          throw new Error('Competition not found');
        }

        await db
          .delete(competitions)
          .where(and(
            eq(competitions.id, input.id),
            eq(competitions.userId, currentUser.id)
          ));

        return { success: true };
      }),
  }),
  auth: t.router({
    signUp: t.procedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const result = await auth.api.signUpEmail({
          body: input,
        });
        return result;
      }),
    signIn: t.procedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const result = await auth.api.signInEmail({
          body: input,
        });
        return result;
      }),
    signOut: t.procedure
      .mutation(async () => {
        const result = await auth.api.signOut();
        return result;
      }),
    getSession: t.procedure
      .query(async () => {
        const result = await auth.api.getSession();
        return result;
      }),
  }),
});

export type AppRouter = typeof router;
