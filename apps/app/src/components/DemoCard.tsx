import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';

export function DemoCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>UI Framework Demo</CardTitle>
        <CardDescription>
          This demonstrates shadcn/ui components with Tailwind CSS integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="default">Submit</Button>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  );
}
