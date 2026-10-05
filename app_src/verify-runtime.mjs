// Environment adapter for Claude's unchanged Linux-path browser checks.
// Usage: NODE_OPTIONS="--import ./app_src/verify-runtime.mjs" node gs/app_flow.mjs <origin>/
import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
const launch = chromium.launch.bind(chromium);
const bundled = chromium.executablePath();
const browser = process.env.GS_BROWSER_PATH || (existsSync(bundled) ? bundled : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
chromium.launch = options => launch(options?.executablePath === '/opt/pw-browsers/chromium'
  ? { ...options, executablePath: browser } : options);
mkdirSync('/tmp/claude-0/shots', { recursive: true });
