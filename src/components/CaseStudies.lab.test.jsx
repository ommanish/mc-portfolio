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
  expect(screen.getByRole("heading", { name: /small patterns\. real frontend problems/i })).toBeInTheDocument();
  expect(screen.getByText(/framework-free examples for motion/i)).toBeInTheDocument();
  const live = screen.getByRole("link", { name: /explore live lab/i });
  expect(live).toHaveAttribute("href", "https://ommanish.github.io/css-practical-lab/");
  expect(live).toHaveAttribute("target", "_blank");
  expect(live).toHaveAttribute("rel", expect.stringContaining("noopener"));
  const github = screen.getByRole("link", { name: /view github/i });
  expect(github).toHaveAttribute("href", "https://github.com/ommanish/css-practical-lab");
  expect(github).toHaveAttribute("target", "_blank");
  expect(github).toHaveAttribute("rel", expect.stringContaining("noopener"));
});

test("CSS Practical Lab stays separate from the seven case studies", () => {
  const { container } = render(<CaseStudies />);
  expect(container.querySelectorAll(".case-study-preview-card")).toHaveLength(7);
  expect(screen.getByRole("heading", { name: /wenamah product catalog/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /vellum & vector studio experience/i })).toBeInTheDocument();
  expect(container.querySelector(".portfolio-lab-feature")).toBeInTheDocument();
  expect(container.querySelector("#lab.portfolio-lab-section")).toBeInTheDocument();
  expect(screen.getByText(/labs & open source/i)).toBeInTheDocument();
});
