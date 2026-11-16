// Run with: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PASS_MARK, hasPassed, scorePercent, newCertificateId } from '../../src/lib/assessmentRules.ts';

test('pass mark is 60%', () => assert.equal(PASS_MARK, 0.6));

test('1 of 42 does not pass', () => assert.equal(hasPassed(1, 42), false));
test('25 of 42 (59.5%) does not pass', () => assert.equal(hasPassed(25, 42), false));
test('26 of 42 (61.9%) passes', () => assert.equal(hasPassed(26, 42), true));
test('0 questions never passes', () => assert.equal(hasPassed(0, 0), false));

test('percent rounds correctly', () => {
  assert.equal(scorePercent(1, 42), 2);
  assert.equal(scorePercent(26, 42), 62);
  assert.equal(scorePercent(0, 0), 0);
});

test('certificate IDs are unique per call', () => {
  const a = newCertificateId(), b = newCertificateId();
  assert.match(a, /^CERT-OHS-\d{8}-[A-Z0-9]+$/);
  assert.notEqual(a, b);
});
