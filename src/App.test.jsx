/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import App from "./App";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import usePersonalization, { AUDIENCE_STORAGE_KEY, EXPLORE_SESSION_KEY } from "./hooks/usePersonalization";
import { getAudienceProfile } from "./lib/personalization";

let observerCallbacks;

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(node) {
    observerCallbacks.set(node, this.callback);
  }

  unobserve(node) {
    observerCallbacks.delete(node);
  }

  disconnect() {}
}

const media = (query) => ({
  matches:false,
  media:query,
  onchange:null,
  addListener:vi.fn(),
  removeListener:vi.fn(),
  addEventListener:vi.fn(),
  removeEventListener:vi.fn(),
  dispatchEvent:vi.fn(),
});

const CANONICAL = ["work","services","web-experience","cases","skills","ai","timeline","contact"];

describe("Trust-first adaptive portfolio", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    observerCallbacks = new Map();
    window.matchMedia = vi.fn().mockImplementation(media);
    window.IntersectionObserver = MockIntersectionObserver;
    global.IntersectionObserver = MockIntersectionObserver;
    window.turnstile = {
      render:vi.fn(() => 1),
      getResponse:vi.fn(() => "token"),
      reset:vi.fn(),
      remove:vi.fn(),
    };
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    delete window.turnstile;
  });

  test("first screen clearly separates preset Lens rules from optional AI", () => {
    render(<App />);
    expect(screen.getByRole("heading",{name:/choose the lens/i})).toBeInTheDocument();
    expect(screen.getByRole("button",{name:/engineering \/ technical/i})).toBeInTheDocument();
    expect(screen.getByText(/^use ai$/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox",{name:/describe what you want to find/i})).toBeInTheDocument();
    expect(screen.getByText(/preset relevance rules/i)).toBeInTheDocument();
    expect(screen.queryByRole("navigation",{name:/primary navigation/i})).not.toBeInTheDocument();
  });

  test("Engineering Lens keeps the canonical Hero and canonical section order", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole("button",{name:/engineering \/ technical/i}));

    expect(screen.getByRole("heading",{name:/turning complex web work into experiences teams can ship with confidence/i})).toBeInTheDocument();
    expect(screen.queryByRole("heading",{name:/frontend depth with enterprise delivery discipline/i})).not.toBeInTheDocument();

    const ids = [...container.querySelectorAll(".spine-chapter")].map((node) => node.id);
    expect(ids).toEqual(CANONICAL);
  });

  test("different Lens choices never reorder the portfolio", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole("button",{name:/engineering \/ technical/i}));
    const engineeringOrder = [...container.querySelectorAll(".spine-chapter")].map((node) => node.id);

    await user.click(screen.getByRole("button",{name:/change lens/i}));
    await user.click(screen.getByRole("button",{name:/ai \/ automation/i}));
    const aiOrder = [...container.querySelectorAll(".spine-chapter")].map((node) => node.id);

    expect(engineeringOrder).toEqual(CANONICAL);
    expect(aiOrder).toEqual(CANONICAL);
  });

  test("Lens adapts guidance with a recommended path instead of rewriting content", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole("button",{name:/engineering \/ technical/i}));

    expect(screen.getByText(/portfolio content and order stay unchanged/i)).toBeInTheDocument();
    expect(screen.getByRole("navigation",{name:/recommended portfolio path/i})).toBeInTheDocument();
    expect(container.querySelectorAll('.spine-chapter[data-recommended="true"]').length).toBe(4);
    expect(container.querySelectorAll('.nav-links a.is-lens-recommended').length).toBe(4);
  });

  test("Engineering Lens opens the existing Frontend Quality capability by default", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button",{name:/engineering \/ technical/i}));
    expect(await screen.findByRole("heading",{name:/raise frontend quality/i})).toBeInTheDocument();
  });

  test("Marketing Lens opens the existing CMS capability by default", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button",{name:/web \/ marketing/i}));
    expect(await screen.findByRole("heading",{name:/modernize cms & page-builder experiences/i})).toBeInTheDocument();
  });

  test("AI-curated Lens explicitly says existing content was not rewritten", () => {
    const profile = getAudienceProfile("engineering");
    render(
      <Hero
        audienceProfile={profile}
        source="ai"
        recommendedSections={["work","cases","skills","timeline"]}
        onChangeLens={() => {}}
      />
    );

    expect(screen.getByText(/ai-curated lens/i)).toBeInTheDocument();
    expect(screen.getByText(/nothing on this page was rewritten/i)).toBeInTheDocument();
    expect(screen.getByRole("heading",{name:/turning complex web work into experiences teams can ship with confidence/i})).toBeInTheDocument();
  });

  test("local intent fallback is transparent and also keeps canonical content", () => {
    const profile = getAudienceProfile("engineering");
    render(
      <Hero
        audienceProfile={profile}
        source="search"
        recommendedSections={["work","cases","skills","timeline"]}
        onChangeLens={() => {}}
      />
    );

    expect(screen.getByText(/intent lens/i)).toBeInTheDocument();
    expect(screen.getByText(/local relevance rules/i)).toBeInTheDocument();
    expect(screen.getByRole("heading",{name:/turning complex web work into experiences teams can ship with confidence/i})).toBeInTheDocument();
  });

  test("navigation appears only after a Lens is selected", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.queryByRole("navigation",{name:/primary navigation/i})).not.toBeInTheDocument();

    await user.click(screen.getByRole("button",{name:/engineering \/ technical/i}));
    expect(screen.getByRole("navigation",{name:/primary navigation/i})).toBeInTheDocument();
  });

  test("all canonical anchors exist exactly once while lower-priority sections can remain deferred", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(screen.getByRole("button",{name:/engineering \/ technical/i}));

    for (const id of CANONICAL) {
      expect(document.querySelectorAll(`#${id}`)).toHaveLength(1);
    }

    expect(container.querySelectorAll('.progressive-section-shell[data-loaded="false"]').length).toBeGreaterThan(0);
  });

  test("deferred section renders when it approaches the viewport", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(screen.getByRole("button",{name:/engineering \/ technical/i}));

    const deferred = container.querySelector('.progressive-section-shell[data-loaded="false"]');
    expect(deferred).toBeInTheDocument();

    const callback = observerCallbacks.get(deferred);
    expect(callback).toBeTypeOf("function");

    act(() => callback([{ isIntersecting:true, target:deferred }]));
    await waitFor(() => expect(deferred.dataset.loaded).toBe("true"));
  });

  test("Change lens clears persistence and returns to the stable first screen", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button",{name:/engineering \/ technical/i}));
    expect(localStorage.getItem(AUDIENCE_STORAGE_KEY)).toBe("engineering");

    await user.click(screen.getByRole("button",{name:/change lens/i}));
    expect(localStorage.getItem(AUDIENCE_STORAGE_KEY)).toBeNull();
    expect(screen.getByRole("heading",{name:/choose the lens/i})).toBeInTheDocument();
  });

  test("Explore the full portfolio stays session-only", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button",{name:/explore the full portfolio/i}));
    expect(localStorage.getItem(AUDIENCE_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(EXPLORE_SESSION_KEY)).toBe("1");
  });

  test("saved explicit audience still skips the Lens screen", () => {
    localStorage.setItem(AUDIENCE_STORAGE_KEY,"engineering");
    render(<App />);
    expect(screen.queryByRole("heading",{name:/choose the lens/i})).not.toBeInTheDocument();
    expect(screen.getByRole("heading",{name:/turning complex web work into experiences teams can ship with confidence/i})).toBeInTheDocument();
  });

  test("cloud AI is not called automatically on mount", async () => {
    const fetchImpl = vi.fn();
    renderHook(() => usePersonalization({apiBase:"https://api.example",fetchImpl,timeoutMs:15}));
    await new Promise((resolve) => setTimeout(resolve,20));
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test("confident AI decision remains session-only", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok:true,
      json:async () => ({
        intent:"engineering",
        confidence:.88,
        priorityTopics:["React"],
        sectionOrder:["cases","skills","work"],
      }),
    }));

    const { result } = renderHook(() =>
      usePersonalization({apiBase:"https://api.example",fetchImpl,timeoutMs:50})
    );

    await act(async () => {
      await result.current.searchIntent("React accessibility architecture");
    });

    await waitFor(() => expect(result.current.source).toBe("ai"));
    expect(result.current.profile.key).toBe("engineering");
    expect(localStorage.getItem(AUDIENCE_STORAGE_KEY)).toBeNull();
  });

  test("Contact remains reason-first and Job company is required", async () => {
    const user = userEvent.setup();
    render(<Contact />);
    await user.click(screen.getByRole("button",{name:/job opportunity/i}));
    expect(screen.getByRole("textbox",{name:/^company/i})).toBeRequired();
  });

  test("Change reason uses the visible adaptive secondary control", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole("button",{name:/job opportunity/i}));

    const changeReason = screen.getByRole("button",{name:/change reason/i});
    expect(changeReason).toHaveClass("contact-change-reason");
    expect(changeReason).toHaveTextContent("Change reason");
  });

  test("Contact success still replaces the form", async () => {
    const user = userEvent.setup();
    const fetchImpl = vi.fn(async () => ({ok:true,json:async () => ({ok:true})}));
    render(<Contact apiBase="https://api.example" turnstileSiteKey="test-key" fetchImpl={fetchImpl} />);
    await user.click(screen.getByRole("button",{name:/consulting project/i}));
    await user.type(screen.getByRole("textbox",{name:/^name/i}),"Manish");
    await user.type(screen.getByRole("textbox",{name:/work email/i}),"manish@example.com");
    await user.type(screen.getByRole("textbox",{name:/message/i}),"A valid project message.");
    await user.click(screen.getByRole("button",{name:/send message/i}));
    expect(await screen.findByRole("heading",{name:/message received/i})).toBeInTheDocument();
  });

  test("Experience rows stay isolated from legacy card timeline styles", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole("button",{name:/engineering \/ technical/i}));
    expect(await screen.findByText("Salesforce — Web Experience Manager, Data 360")).toBeInTheDocument();

    expect(container.querySelectorAll(".executive-timeline-item")).toHaveLength(7);
    expect(container.querySelectorAll(".timeline-item")).toHaveLength(0);
    expect(container.querySelectorAll(".timeline-list")).toHaveLength(0);
    expect(container.querySelectorAll(".executive-timeline-content")).toHaveLength(7);
  });

  test("Experience shows corrected TechDemocracy and Quantious dates", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button",{name:/engineering \/ technical/i}));

    expect(await screen.findByText("Mar 2025 — Jul 2026")).toBeInTheDocument();
    expect(screen.getByText("TechDemocracy / Quantious — UI/UX Lead, Salesforce Data Cloud Page Builder")).toBeInTheDocument();
    expect(screen.getByText("Feb 2024 — Jul 2026")).toBeInTheDocument();
    expect(screen.getByText("TechDemocracy — Senior UI Frontend Developer & Designer")).toBeInTheDocument();
  });

});
