import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">RefBook</h1>
      <p className="mt-2">Welcome to the Referee Application</p>
    </div>
  );
}
