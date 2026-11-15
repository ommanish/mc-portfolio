/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import CaseStudyDetail from "./CaseStudyDetail";

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

test("Second Look uses a download-site link and identifies its actual report image", () => {
  render(<CaseStudyDetail slug="second-look-ux-review" />);
  const download = screen.getByRole("link", { name: /visit website & download/i });
  expect(download).toHaveAttribute("href", "https://ommanish.github.io/second-look-download/");
  expect(download).toHaveAttribute("rel", "noopener noreferrer");
  expect(screen.queryByRole("button", { name: /open interactive demo/i })).not.toBeInTheDocument();
  expect(screen.getByRole("img", { name: /second look report with a page screenshot/i })).toBeInTheDocument();
  expect(screen.getByText(/actual report screenshot/i)).toBeInTheDocument();
  expect(screen.getByText(/release snapshot/i)).toHaveTextContent("both identify v0.10.0, with 45 documented checks");
});

test("Vellum demo opens in a windowed modal at the animated hero", async () => {
  const user = userEvent.setup();
  render(<CaseStudyDetail slug="vellum-vector-studio" />);

  await user.click(screen.getByRole("button", { name: /open interactive demo/i }));

  const dialog = screen.getByRole("dialog", { name: /vellum & vector studio experience/i });
  const backdrop = document.body.querySelector(".case-study-demo-backdrop");
  const iframe = screen.getByTitle(/vellum & vector studio experience demo/i);

  expect(dialog).toHaveClass("case-study-demo-modal");
  expect(dialog).toHaveClass("case-study-demo-modal--windowed");
  expect(backdrop.parentElement).toBe(document.body);
  expect(iframe).toHaveAttribute("src", "/demos/vellum-vector-studio.html#top");
});

test("Wenamah stage demo uses the same viewport modal", async () => {
  const user = userEvent.setup();
  render(<CaseStudyDetail slug="wenamah-product-catalog" />);

  await user.click(screen.getByRole("button", { name: /open stage demo/i }));

  expect(screen.getByRole("dialog", { name: /wenamah product catalog & admin/i })).toHaveClass("case-study-demo-modal--windowed");
  expect(screen.getByTitle(/wenamah product catalog & admin demo/i)).toHaveAttribute(
    "src",
    "https://ommanish.github.io/wenamah-stage/"
  );
});
