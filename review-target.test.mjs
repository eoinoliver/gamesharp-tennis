import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewTarget} from './tools/review-target.mjs';

const origin = 'https://gamesharp-tennis-review123-eoinlynn-5978s-projects.vercel.app';
test('verifiers accept only the deliberately selected Tennis deployment', () => {
  assert.equal(reviewTarget(origin + '/index.html?test=1', origin).origin, origin);
  for (const allowed of ['http://127.0.0.1:8766/', 'http://localhost:8766/', 'http://[::1]:8766/', 'https://www.gamesharptennis.com/']) {
    assert.equal(reviewTarget(allowed, '').href, allowed);
  }
  for (const [target, approved] of [
    [origin, ''], [origin, origin + '/path'], [origin, origin + '?extra=1'],
    [origin.replace('review123', 'different'), origin],
    [origin.replace('https:', 'http:'), origin], [origin + ':444/', origin],
    [origin.replace('https://', 'https://user:password@'), origin],
    [origin + '.example.com', origin + '.example.com'],
    [origin.replace('gamesharp-tennis', 'gamesharp-golf'), origin.replace('gamesharp-tennis', 'gamesharp-golf')],
    ['https://another-project.vercel.app', 'https://another-project.vercel.app'],
    ['file:///index.html', ''], ['http://www.gamesharptennis.com/', '']
  ]) assert.throws(() => reviewTarget(target, approved), target);
});
