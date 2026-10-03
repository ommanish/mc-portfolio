/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import CaseStudies from "./CaseStudies";

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("Case Studies includes the CSS Practical Lab with safe external links", () => {
  render(<CaseStudies />);
  expect(screen.getByRole("heading", { name: /css practical lab/i })).toBeInTheDocument();
  expect(screen.getByText(/reusable frontend interaction patterns/i)).toBeInTheDocument();
  const live = screen.getByRole("link", { name: /explore live lab/i });
  expect(live).toHaveAttribute("href", "https://ommanish.github.io/css-practical-lab/");
  expect(live).toHaveAttribute("target", "_blank");
  expect(live).toHaveAttribute("rel", expect.stringContaining("noopener"));
  const github = screen.getByRole("link", { name: /view github/i });
  expect(github).toHaveAttribute("href", "https://github.com/ommanish/css-practical-lab");
});

test("Lab projects stay separate from the five case studies", () => {
  const { container } = render(<CaseStudies />);
  expect(container.querySelectorAll(".case-study-preview-card")).toHaveLength(5);
  expect(container.querySelector("#lab.portfolio-lab-section")).toBeInTheDocument();
  expect(screen.getByText(/lab & open source/i)).toBeInTheDocument();
});

test("Interactive Component Lab is presented as a standalone practical Lab", () => {
  const { container } = render(<CaseStudies />);
  expect(screen.getByRole("heading", { name: /interactive component lab/i })).toBeInTheDocument();
  expect(screen.getByText(/real source code and reusable prompts for ai-assisted development/i)).toBeInTheDocument();
  const experience = screen.getByRole("link", { name: /explore interactive lab/i });
  expect(experience).toHaveAttribute("href", "/labs/interactive-component-lab/");
  expect(container.querySelectorAll(".case-study-preview-card")).toHaveLength(5);
  expect(container.innerHTML).not.toMatch(/labs\/interactive-component-lab\/(?:css|js)\//);
});
