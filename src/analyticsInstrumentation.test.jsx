/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import WelcomeExperience from "./components/WelcomeExperience";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import { getAudienceProfile } from "./lib/personalization";

const media = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

describe("Privacy-first analytics instrumentation", () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation(media);
    window.turnstile = {
      render: vi.fn(() => 1),
      getResponse: vi.fn(() => "token"),
      reset: vi.fn(),
      remove: vi.fn(),
    };
    window.mcPortfolioAnalytics = {
      track: vi.fn(),
      getContext: vi.fn(() => ({
        sessionId: "session-analytics-12345",
        path: "/new/",
        landingPath: "/",
        referrerHostname: "linkedin.com",
        campaign: { source: "linkedin", medium: "social", campaign: "portfolio" },
        device: "desktop",
        lens: "recruiter",
        resumeClicked: true,
        caseStudyClicks: 2,
        journey: ["page_visit", "lens_selected", "resume_click", "contact_reason"],
      })),
    };
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    delete window.turnstile;
    delete window.mcPortfolioAnalytics;
  });

  test("Lens buttons keep their visible labels and add only analytics metadata", () => {
    render(
      <WelcomeExperience
        onSelectAudience={() => {}}
        onSearchIntent={() => {}}
        onExploreNormally={() => {}}
      />
    );

    const recruiter = screen.getByRole("button", { name: /hiring \/ recruiting/i });
    expect(recruiter).toHaveAttribute("data-analytics-event", "lens_selected");
    expect(recruiter).toHaveAttribute("data-analytics-value", "recruiter");
    expect(recruiter).toHaveTextContent("Hiring / Recruiting");

    const explore = screen.getByRole("button", { name: /explore the full portfolio/i });
    expect(explore).toHaveAttribute("data-analytics-event", "portfolio_cta_click");
    expect(explore).toHaveAttribute("data-analytics-value", "explore-full");
  });

  test("Hero visible actions stay unchanged while carrying click metadata", () => {
    const profile = getAudienceProfile("recruiter");
    render(
      <Hero
        audienceProfile={profile}
        source="selected"
        recommendedSections={["work","cases","skills","timeline"]}
        onChangeLens={() => {}}
      />
    );

    const resume = screen.getByRole("link", { name: /view resume/i });
    expect(resume).toHaveAttribute("data-analytics-event", "resume_click");
    expect(resume).toHaveTextContent("View resume");

    const changeLens = screen.getByRole("button", { name: /change lens/i });
    expect(changeLens).toHaveAttribute("data-analytics-event", "change_lens");

    const primary = screen.getAllByRole("link").find((node) => node.classList.contains("btn-primary"));
    expect(primary).toHaveAttribute("data-analytics-event", "portfolio_cta_click");
    expect(primary).toHaveAttribute("data-analytics-value", "hero-primary");
  });

  test("Footer social links keep the same visible UI with analytics metadata", () => {
    render(<Footer onRestart={() => {}} />);

    const linkedin = screen.getByRole("link", { name: "LinkedIn" });
    const github = screen.getByRole("link", { name: "GitHub" });
    const resume = screen.getByRole("link", { name: "Resume" });

    expect(linkedin).toHaveAttribute("data-analytics-event", "linkedin_click");
    expect(github).toHaveAttribute("data-analytics-event", "github_click");
    expect(resume).toHaveAttribute("data-analytics-event", "resume_click");
    expect(screen.getByText("Follow me")).toBeInTheDocument();
  });

  test("Contact reason buttons add metadata without changing the reason-first flow", async () => {
    const user = userEvent.setup();
    render(<Contact apiBase="https://api.example" turnstileSiteKey="test-site-key" />);

    const job = screen.getByRole("button", { name: /job opportunity/i });
    expect(job).toHaveAttribute("data-analytics-event", "contact_reason");
    expect(job).toHaveAttribute("data-analytics-value", "job");

    await user.click(job);
    expect(screen.getByRole("button", { name: /change reason/i })).toBeInTheDocument();
  });

  test("Contact submit includes anonymous conversion context and keeps success UI unchanged", async () => {
    const user = userEvent.setup();
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({ ok: true }),
    }));

    render(
      <Contact
        apiBase="https://api.example"
        turnstileSiteKey="test-site-key"
        fetchImpl={fetchImpl}
      />
    );

    await user.click(screen.getByRole("button", { name: /consulting project/i }));
    await waitFor(() => expect(window.turnstile.render).toHaveBeenCalled());

    await user.type(screen.getByRole("textbox", { name: /^name/i }), "Manish");
    await user.type(screen.getByRole("textbox", { name: /work email/i }), "manish@example.com");
    await user.type(screen.getByRole("textbox", { name: /message/i }), "A valid analytics conversion test message.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(payload.submissionId).toMatch(/^[A-Za-z0-9._:-]{8,100}$/);
    expect(payload.analytics.sessionId).toBe("session-analytics-12345");
    expect(payload.analytics.referrerHostname).toBe("linkedin.com");
    expect(payload.analytics.resumeClicked).toBe(true);
    expect(payload.analytics.journey).toContain("resume_click");
    expect(payload.analytics).not.toHaveProperty("email");
    expect(payload.analytics).not.toHaveProperty("message");

    expect(await screen.findByRole("heading", { name: /message received/i })).toBeInTheDocument();
  });
});
