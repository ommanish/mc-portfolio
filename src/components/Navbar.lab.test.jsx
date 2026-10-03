/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Navbar from "./Navbar";

afterEach(cleanup);

test("primary navigation includes a Lab link to the CSS Practical Lab anchor", () => {
  render(
    <Navbar
      isLight={false}
      onThemeToggle={() => {}}
      showNavigation
      recommendedSections={[]}
    />
  );

  const lab = screen.getByRole("link", { name: "Lab" });
  expect(lab).toHaveAttribute("href", "#lab");
});
