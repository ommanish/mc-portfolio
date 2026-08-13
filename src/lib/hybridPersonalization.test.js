import assert from 'node:assert/strict';
import test from 'node:test';
import { createSessionId, sanitizeAiDecision, localDecision, shouldRequestAi } from './hybridPersonalization.js';

test('AI decision cannot inject unknown sections or audience keys', () => {
  const result = sanitizeAiDecision({ intent: 'admin', confidence: 4, sectionOrder: ['cases','evil','contact'] });
  assert.equal(result.intent, 'general');
  assert.equal(result.confidence, 1);
  assert.equal(result.sectionOrder.includes('evil'), false);
});

test('AI section order keeps complete portfolio available', () => {
  const result = sanitizeAiDecision({ intent: 'engineering', confidence: 0.9, sectionOrder: ['cases','skills'] });
  assert.equal(result.sectionOrder[0], 'cases');
  assert.equal(result.sectionOrder.includes('services'), true);
  assert.equal(result.sectionOrder.includes('contact'), true);
  assert.equal(new Set(result.sectionOrder).size, result.sectionOrder.length);
});

test('local fallback still maps explicit technical intent', () => {
  assert.equal(localDecision({ query: 'React accessibility architecture' }).intent, 'engineering');
});


test('manual audience choice blocks automatic AI until explicitly forced', () => {
  assert.equal(shouldRequestAi({ manualSelection: true }), false);
  assert.equal(shouldRequestAi({ manualSelection: true, force: true }), true);
});


test('session ID fallback uses cryptographic random values', () => {
  let randomValuesCalls = 0;

  const cryptoObj = {
    getRandomValues(buffer) {
      randomValuesCalls += 1;
      for (let i = 0; i < buffer.length; i += 1) {
        buffer[i] = i + 1;
      }
      return buffer;
    },
  };

  const storage = {
    getItem() {
      return null;
    },
    setItem() {},
  };

  const id = createSessionId(storage, cryptoObj);

  assert.equal(randomValuesCalls, 1);
  assert.equal(
    id,
    'session-0102030405060708090a0b0c0d0e0f10'
  );
});
