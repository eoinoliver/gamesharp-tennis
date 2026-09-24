// Test-target permission only. Runtime content eligibility is unchanged.
const localHosts = new Set(['127.0.0.1', 'localhost', '[::1]']);
const publicHosts = new Set(['gamesharptennis.com', 'www.gamesharptennis.com']);
const deploymentHost = /^gamesharp-tennis-[a-z0-9-]+-eoinlynn-5978s-projects\.vercel\.app$/;

export function reviewTarget(input, approvedOrigin = process.env.GS_REVIEW_ORIGIN) {
  const url = new URL(input);
  if (url.username || url.password) throw Error('Review targets cannot contain credentials.');
  if (localHosts.has(url.hostname) && ['http:', 'https:'].includes(url.protocol)) return url;
  if (url.protocol !== 'https:' || url.port) throw Error('Remote review requires HTTPS on the default port.');
  if (publicHosts.has(url.hostname)) return url;
  if (approvedOrigin) {
    const approved = new URL(approvedOrigin);
    if (approved.protocol === 'https:' && !approved.port && !approved.username &&
        !approved.password && approved.pathname === '/' && !approved.search &&
        !approved.hash && deploymentHost.test(approved.hostname) &&
        url.origin === approved.origin) return url;
  }
  throw Error('Use localhost, the production domain, or the exact verified Tennis deployment origin in GS_REVIEW_ORIGIN.');
}
