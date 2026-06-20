import { defineConfig, devices } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const PORT = 4173;
const baseURL = `http://127.0.0.1:${PORT}`;

function loadEnvValue(key: string, fallback: string): string {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    return process.env[key] ?? fallback;
  }

  const line = readFileSync(envPath, 'utf8')
    .split('\n')
    .find((row) => row.startsWith(`${key}=`));

  if (!line) {
    return process.env[key] ?? fallback;
  }

  return line.slice(key.length + 1).trim() || fallback;
}

const supabaseUrl = loadEnvValue('VITE_SUPABASE_URL', 'https://placeholder.supabase.co');
const supabaseAnonKey = loadEnvValue(
  'VITE_SUPABASE_ANON_KEY',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
);

process.env.VITE_SUPABASE_URL = supabaseUrl;
process.env.VITE_SUPABASE_ANON_KEY = supabaseAnonKey;

export default defineConfig({
  testDir: './e2e',
  // Live-site checks — run via `npm run test:e2e:production` (playwright.production.config.ts).
  testIgnore: '**/production-smoke.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Serial workers avoid flaky route mocks and preview-server contention locally.
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      VITE_SUPABASE_URL: supabaseUrl,
      VITE_SUPABASE_ANON_KEY: supabaseAnonKey,
    },
  },
});
