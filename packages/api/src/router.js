import { initTRPC } from '@trpc/server';
import * as z from 'zod';
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
});
