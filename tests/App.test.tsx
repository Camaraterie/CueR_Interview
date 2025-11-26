import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the geminiService
vi.mock('../services/geminiService', () => ({
  askChris: vi.fn().mockResolvedValue('Mock AI response'),
  evaluateInterview: vi.fn().mockResolvedValue(false),
  generatePersonaFromResume: vi.fn().mockResolvedValue('Mock persona'),
  CHRIS_PERSONA: 'Mock persona text',
}));

describe('App Component', () => {
  it('should render the cover page initially', () => {
    render(<App />);

    expect(screen.getByText('From Scalpel to Silicon')).toBeInTheDocument();
    expect(screen.getByText('An unexpected journey of intelligence.')).toBeInTheDocument();
  });

  it('should display page navigation controls', () => {
    render(<App />);

    const nextButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
    expect(nextButton).toBeInTheDocument();
  });

  it('should navigate to next page when next button is clicked', async () => {
    render(<App />);

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1]; // Get last button (next)

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/To my wife, and my daughter/)).toBeInTheDocument();
    });
  });

  it('should display current page number', () => {
    render(<App />);

    expect(screen.getByText(/Page/)).toBeInTheDocument();
  });

  it('should have proper responsive behavior', () => {
    // Test desktop view
    global.innerWidth = 1024;
    fireEvent(window, new Event('resize'));

    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});

describe('MessageRenderer Component', () => {
  it('should render plain text without tags', () => {
    const { container } = render(
      <div className="text-raised-light">
        Plain text message
      </div>
    );

    expect(container.textContent).toContain('Plain text message');
  });

  it('should handle CLUE tags', () => {
    const text = '[CLUE]Secret hint[/CLUE] normal text';
    const { container } = render(<div>{text}</div>);

    expect(container.textContent).toContain('Secret hint');
  });

  it('should handle TECH tags', () => {
    const text = '[TECH]React[/TECH] is great';
    const { container } = render(<div>{text}</div>);

    expect(container.textContent).toContain('React');
  });

  it('should handle multiple tag types', () => {
    const text = '[TECH]TypeScript[/TECH] and [SOUL]passion[/SOUL]';
    const { container } = render(<div>{text}</div>);

    expect(container.textContent).toContain('TypeScript');
    expect(container.textContent).toContain('passion');
  });

  it('should preserve whitespace in tagged content', () => {
    const text = '[CLUE]Multi\nline\ntext[/CLUE]';
    const { container } = render(<div className="whitespace-pre-wrap">{text}</div>);

    expect(container.textContent).toContain('Multi');
  });
});

describe('Interactive Features', () => {
  it('should render chat interface on back cover', async () => {
    render(<App />);

    // Navigate to last page (back cover)
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];

    // Click multiple times to reach the end
    for (let i = 0; i < 6; i++) {
      fireEvent.click(nextButton);
      await waitFor(() => {}, { timeout: 100 });
    }

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });
});
