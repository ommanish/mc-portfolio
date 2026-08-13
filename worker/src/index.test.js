import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { validateContactPayload, validatePersonalizationPayload } from './index.js';

const now = 10_000;
const validContact = { name:'Recruiter', email:'r@example.com', company:'Example Co', reason:'job', role:'Director', jobUrl:'https://example.com/job', message:'A legitimate message for Manish.', website:'', turnstileToken:'token', startedAt: 5_000 };

test('job inquiry requires company on server', () => {
  const result = validateContactPayload({ ...validContact, company:'' }, now);
  assert.equal(result.ok, false);
  assert.match(result.message, /Company is required/);
});

test('honeypot submission is rejected', () => {
  assert.equal(validateContactPayload({ ...validContact, website:'spam' }, now).ok, false);
});

test('too-fast form completion is rejected', () => {
  assert.equal(validateContactPayload({ ...validContact, startedAt:9_000 }, now).ok, false);
});

test('personalization strips unknown section keys', () => {
  const result = validatePersonalizationPayload({ sessionId:'session-12345', viewedSections:['cases','evil'], explicitQuery:'React' });
  assert.equal(result.ok, true);
  assert.deepEqual(result.value.viewedSections, ['cases']);
});


test('OpenAI personalization requests disable response storage', async () => {
  const originalFetch = globalThis.fetch;
  let openaiBody;

  globalThis.fetch = async (url, options = {}) => {
    if (String(url).includes('api.openai.com/v1/responses')) {
      openaiBody = JSON.parse(options.body);
      return new Response(JSON.stringify({
        output_text: JSON.stringify({
          intent: 'general',
          confidence: 0.9,
          priorityTopics: [],
          sectionOrder: ['work','services','web-experience','cases','skills','ai','timeline','contact'],
        }),
      }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };

  try {
    await worker.fetch(
      new Request('https://api.example.com/api/personalize', {
        method: 'POST',
        headers: {
          origin: 'https://manishchawla.com',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ sessionId: 'session-12345' }),
      }),
      {
        ALLOWED_ORIGINS: 'https://manishchawla.com',
        OPENAI_API_KEY: 'test-key',
        OPENAI_MODEL: 'gpt-5-mini',
      }
    );

    assert.equal(openaiBody.store, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});


test('strong technical signals override recruiter AI classification', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options = {}) => {
    if (String(url).includes('api.openai.com/v1/responses')) {
      return new Response(JSON.stringify({
        output_text: JSON.stringify({
          intent: 'recruiter',
          confidence: 0.78,
          priorityTopics: ['React', 'accessibility', 'leadership'],
          sectionOrder: ['cases','skills','work','web-experience','contact','services','timeline','ai'],
        }),
      }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    throw new Error(`Unexpected fetch: ${url}`);
  };

  try {
    const response = await worker.fetch(
      new Request('https://api.example.com/api/personalize', {
        method: 'POST',
        headers: {
          origin: 'https://manishchawla.com',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: 'technical-test-12345',
          referrerHostname: 'github.com',
          explicitQuery: 'React accessibility leadership',
          viewedSections: ['cases', 'skills'],
        }),
      }),
      {
        ALLOWED_ORIGINS: 'https://manishchawla.com',
        OPENAI_API_KEY: 'test-key',
        OPENAI_MODEL: 'gpt-5-mini',
      }
    );

    const result = await response.json();

    assert.equal(result.intent, 'engineering');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
