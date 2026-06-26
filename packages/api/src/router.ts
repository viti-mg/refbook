import { initTRPC } from '@trpc/server';
import * as z from 'zod';
import { auth } from '@packages/auth';

const t = initTRPC.create();

export const router = t.router({
  competitions: t.router({
    list: t.procedure.query(() => {
      return [];
    }),
    create: t.procedure
      .input(z.object({
        name: z.string(),
        sportType: z.string(),
      }))
      .mutation(({ input }) => {
        return { id: '1', ...input };
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
