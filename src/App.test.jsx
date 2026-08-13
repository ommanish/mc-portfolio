/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import App from "./App";
import Contact from "./components/Contact";
import usePersonalization, { AUDIENCE_STORAGE_KEY, EXPLORE_SESSION_KEY } from "./hooks/usePersonalization";

class MockIntersectionObserver { observe(){} unobserve(){} disconnect(){} }
const media = (query) => ({ matches:false, media:query, onchange:null, addListener:vi.fn(), removeListener:vi.fn(), addEventListener:vi.fn(), removeEventListener:vi.fn(), dispatchEvent:vi.fn() });

describe("Premium AI portfolio redesign", () => {
  beforeEach(() => {
    localStorage.clear(); sessionStorage.clear();
    window.matchMedia = vi.fn().mockImplementation(media);
    window.IntersectionObserver = MockIntersectionObserver;
    global.IntersectionObserver = MockIntersectionObserver;
    window.turnstile = { render:vi.fn(() => 1), getResponse:vi.fn(() => "token"), reset:vi.fn(), remove:vi.fn() };
  });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); delete window.turnstile; });

  test("new visitor sees Welcome while portfolio and section nav are unmounted", () => {
    render(<App />);
    expect(screen.getByRole("heading",{name:/what brings you here/i})).toBeInTheDocument();
    expect(screen.queryByRole("region",{name:/hero/i})).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation",{name:/primary navigation/i})).not.toBeInTheDocument();
  });

  test("AI input is progressive instead of shown with audience choices", async () => {
    const user = userEvent.setup(); render(<App />);
    expect(screen.getByRole("button",{name:/engineering \/ technical/i})).toBeInTheDocument();
    expect(screen.queryByRole("textbox",{name:/what are you looking for/i})).not.toBeInTheDocument();
    await user.click(screen.getByRole("button",{name:/tell ai what you’re looking for/i}));
    expect(screen.getByRole("textbox",{name:/what are you looking for/i})).toBeInTheDocument();
    expect(screen.queryByRole("button",{name:/engineering \/ technical/i})).not.toBeInTheDocument();
  });

  test("explicit Engineering selection reveals correct portfolio and persists", async () => {
    const user = userEvent.setup(); render(<App />);
    await user.click(screen.getByRole("button",{name:/engineering \/ technical/i}));
    expect(screen.getByRole("region",{name:/hero/i})).toBeInTheDocument();
    expect(screen.getByRole("heading",{name:/frontend depth with enterprise delivery discipline/i})).toBeInTheDocument();
    expect(localStorage.getItem(AUDIENCE_STORAGE_KEY)).toBe("engineering");
  });

  test("Explore without personalizing is session-only", async () => {
    const user = userEvent.setup(); render(<App />);
    await user.click(screen.getByRole("button",{name:/explore without personalizing/i}));
    expect(screen.getByRole("region",{name:/hero/i})).toBeInTheDocument();
    expect(localStorage.getItem(AUDIENCE_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(EXPLORE_SESSION_KEY)).toBe("1");
  });

  test("saved explicit audience skips Welcome", () => {
    localStorage.setItem(AUDIENCE_STORAGE_KEY,"engineering"); render(<App />);
    expect(screen.queryByRole("heading",{name:/what brings you here/i})).not.toBeInTheDocument();
    expect(screen.getByRole("heading",{name:/frontend depth with enterprise delivery discipline/i})).toBeInTheDocument();
  });

  test("Reset clears personalization and returns Welcome", async () => {
    const user = userEvent.setup(); localStorage.setItem(AUDIENCE_STORAGE_KEY,"engineering"); render(<App />);
    await user.click(screen.getByRole("button",{name:/engineering view/i}));
    await user.click(screen.getByRole("button",{name:/reset personalization and return to welcome/i}));
    expect(localStorage.getItem(AUDIENCE_STORAGE_KEY)).toBeNull();
    expect(screen.getByRole("heading",{name:/what brings you here/i})).toBeInTheDocument();
  });

  test("Adjust dialog closes with Escape and returns focus", async () => {
    const user = userEvent.setup(); localStorage.setItem(AUDIENCE_STORAGE_KEY,"engineering"); render(<App />);
    const change = screen.getByRole("button",{name:/engineering view/i}); await user.click(change);
    expect(screen.getByRole("dialog")).toBeInTheDocument(); await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); expect(change).toHaveFocus();
  });

  test("cloud AI is not called automatically on mount", async () => {
    const fetchImpl = vi.fn();
    renderHook(() => usePersonalization({apiBase:"https://api.example",fetchImpl,timeoutMs:15}));
    await new Promise((r) => setTimeout(r,20));
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test("confident AI decision is used but not persisted permanently", async () => {
    const fetchImpl = vi.fn(async () => ({ok:true,json:async () => ({intent:"engineering",confidence:.88,priorityTopics:["React"],sectionOrder:["cases","skills","work"]})}));
    const { result } = renderHook(() => usePersonalization({apiBase:"https://api.example",fetchImpl,timeoutMs:50}));
    await act(async () => { await result.current.searchIntent("React accessibility architecture"); });
    await waitFor(() => expect(result.current.source).toBe("ai"));
    expect(result.current.profile.key).toBe("engineering");
    expect(result.current.profile.sectionOrder[0]).toBe("cases");
    expect(localStorage.getItem(AUDIENCE_STORAGE_KEY)).toBeNull();
  });

  test("low-confidence AI keeps deterministic local fallback", async () => {
    const fetchImpl = vi.fn(async () => ({ok:true,json:async () => ({intent:"general",confidence:.2,priorityTopics:[],sectionOrder:["work"]})}));
    const { result } = renderHook(() => usePersonalization({apiBase:"https://api.example",fetchImpl,timeoutMs:50}));
    await act(async () => { await result.current.searchIntent("React accessibility architecture"); });
    await waitFor(() => expect(result.current.stage).toBe("portfolio"));
    expect(result.current.profile.key).toBe("engineering");
    expect(result.current.source).toBe("search");
  });

  test("AI timeout reveals local fallback", async () => {
    const fetchImpl = vi.fn(() => new Promise(() => {}));
    const { result } = renderHook(() => usePersonalization({apiBase:"https://api.example",fetchImpl,timeoutMs:10}));
    await act(async () => { await result.current.searchIntent("React accessibility architecture"); });
    await waitFor(() => expect(result.current.stage).toBe("portfolio"));
    expect(result.current.profile.key).toBe("engineering");
  });

  test("Contact is reason-first; Job company is required", async () => {
    const user = userEvent.setup(); render(<Contact />);
    expect(screen.queryByRole("textbox",{name:/^name/i})).not.toBeInTheDocument();
    await user.click(screen.getByRole("button",{name:/job opportunity/i}));
    expect(screen.getByRole("textbox",{name:/^company/i})).toBeRequired();
    expect(screen.getByRole("textbox",{name:/job title \/ role/i})).toBeInTheDocument();
  });

  test("Consulting company is optional and job-only fields stay hidden", async () => {
    const user = userEvent.setup(); render(<Contact />);
    await user.click(screen.getByRole("button",{name:/consulting project/i}));
    expect(screen.getByRole("textbox",{name:/^company/i})).not.toBeRequired();
    expect(screen.queryByRole("textbox",{name:/job title \/ role/i})).not.toBeInTheDocument();
  });

  test("Contact success replaces form", async () => {
    const user = userEvent.setup();
    const fetchImpl = vi.fn(async () => ({ok:true,json:async () => ({ok:true})}));
    render(<Contact apiBase="https://api.example" turnstileSiteKey="test-key" fetchImpl={fetchImpl} />);
    await user.click(screen.getByRole("button",{name:/consulting project/i}));
    await user.type(screen.getByRole("textbox",{name:/^name/i}),"Manish");
    await user.type(screen.getByRole("textbox",{name:/work email/i}),"manish@example.com");
    await user.type(screen.getByRole("textbox",{name:/message/i}),"A valid project message.");
    await user.click(screen.getByRole("button",{name:/send message/i}));
    expect(await screen.findByRole("heading",{name:/message received/i})).toBeInTheDocument();
    expect(screen.queryByRole("textbox",{name:/^name/i})).not.toBeInTheDocument();
  });

  test("Contact error preserves values", async () => {
    const user = userEvent.setup();
    const fetchImpl = vi.fn(async () => ({ok:false,json:async () => ({message:"Please try again."})}));
    render(<Contact apiBase="https://api.example" turnstileSiteKey="test-key" fetchImpl={fetchImpl} />);
    await user.click(screen.getByRole("button",{name:/ai collaboration/i}));
    const name = screen.getByRole("textbox",{name:/^name/i});
    const email = screen.getByRole("textbox",{name:/work email/i});
    const message = screen.getByRole("textbox",{name:/message/i});
    await user.type(name,"Manish"); await user.type(email,"manish@example.com"); await user.type(message,"A valid AI collaboration message.");
    await user.click(screen.getByRole("button",{name:/send message/i}));
    expect(await screen.findByRole("alert")).toHaveTextContent(/please try again/i);
    expect(name).toHaveValue("Manish"); expect(email).toHaveValue("manish@example.com"); expect(message).toHaveValue("A valid AI collaboration message.");
  });

  test("Turnstile expiration preserves form values", async () => {
    const user = userEvent.setup();
    render(<Contact apiBase="https://api.example" turnstileSiteKey="test-key" fetchImpl={vi.fn()} />);
    await user.click(screen.getByRole("button",{name:/job opportunity/i}));
    const name = screen.getByRole("textbox",{name:/^name/i}); await user.type(name,"Manish");
    await waitFor(() => expect(window.turnstile.render).toHaveBeenCalled());
    window.turnstile.render.mock.calls[0][1]["expired-callback"]();
    expect(name).toHaveValue("Manish"); expect(window.turnstile.reset).toHaveBeenCalled();
  });
});
