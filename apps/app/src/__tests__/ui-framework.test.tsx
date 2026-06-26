import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input } from '@packages/ui';

describe('UI Framework Components', () => {
  describe('Button', () => {
    it('should render a button with default styles', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('inline-flex');
    });

    it('should render button with variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button', { name: 'Outline' });
      expect(button).toBeInTheDocument();
    });

    it('should render button with size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button', { name: 'Large' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Card', () => {
    it('should render a card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
        </Card>
      );
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Input', () => {
    it('should render an input field', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('flex');
    });

    it('should render input with type', () => {
      render(<Input type="email" placeholder="Email" />);
      const input = screen.getByPlaceholderText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });
  });

  describe('Tailwind CSS Integration', () => {
    it('should apply Tailwind classes correctly', () => {
      render(<Button className="custom-class">Test</Button>);
      const button = screen.getByRole('button', { name: 'Test' });
      expect(button).toHaveClass('custom-class');
    });
  });
});
