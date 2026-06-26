import { createFileRoute } from '@tanstack/react-router';
import SignUp from '../components/SignUp';

export const Route = createFileRoute('/auth/register')({
  component: Register,
});

function Register() {
  return <SignUp />;
}
