import { createFileRoute } from '@tanstack/react-start';
import { auth } from '@packages/auth';

export const Route = createFileRoute('/api/auth/$')({
  handler: async ({ request }) => {
    return auth.handler(request);
  },
});