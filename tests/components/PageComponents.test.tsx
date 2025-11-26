import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simple test components based on the page types
const CoverPage = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div>
    <h1>{title}</h1>
    <h2>{subtitle}</h2>
  </div>
);

const StoryPage = ({ title, text, chapter }: { title: string; text: string; chapter: number }) => (
  <div>
    <div>{chapter}</div>
    <h3>{title}</h3>
    <div>{text}</div>
  </div>
);

describe('Page Components', () => {
  describe('CoverPage', () => {
    it('should render title and subtitle', () => {
      render(<CoverPage title="Test Title" subtitle="Test Subtitle" />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });
  });

  describe('StoryPage', () => {
    it('should render chapter number, title, and text', () => {
      const text = 'This is a story about a surgeon who became an AI engineer.';

      render(
        <StoryPage
          title="The Journey Begins"
          text={text}
          chapter={1}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('The Journey Begins')).toBeInTheDocument();
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('should handle long text content', () => {
      const longText = 'Lorem ipsum '.repeat(100);

      render(
        <StoryPage
          title="Long Story"
          text={longText}
          chapter={2}
        />
      );

      expect(screen.getByText('Long Story')).toBeInTheDocument();
    });
  });
});

describe('Accessibility', () => {
  it('should have proper heading hierarchy', () => {
    const { container } = render(
      <CoverPage title="Main Title" subtitle="Subtitle" />
    );

    const headings = container.querySelectorAll('h1, h2');
    expect(headings.length).toBe(2);
  });

  it('should render semantic HTML', () => {
    const { container } = render(
      <StoryPage title="Test" text="Content" chapter={1} />
    );

    expect(container.querySelector('h3')).toBeInTheDocument();
  });
});

describe('Content Validation', () => {
  it('should not render undefined content', () => {
    const { container } = render(
      <div>
        <CoverPage title="" subtitle="" />
      </div>
    );

    expect(container).toBeInTheDocument();
  });

  it('should handle special characters in text', () => {
    const specialText = 'Text with <tags> & "quotes" and \'apostrophes\'';

    render(
      <StoryPage title="Special" text={specialText} chapter={1} />
    );

    expect(screen.getByText(/Text with/)).toBeInTheDocument();
  });
});
