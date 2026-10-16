import { config as loadDotenv } from 'dotenv';
import * as path from 'path';

/**
 * Loads the repo-root .env file. Resolved from `__dirname` rather than
 * `process.cwd()` so it works the same whether the app is started from this
 * package's own directory (`npm run start:dev`) or from anywhere else
 * (`node dist/main` run from a different CWD, a process manager, etc).
 *
 * This file lives two levels under the package root in both dev
 * (`src/config`) and prod (`dist/config`), and the package itself is one
 * level under the repo root where `.env` lives — hence three `..` segments.
 */
export function loadRepoEnv(): void {
  loadDotenv({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
}

export function getAdminMockToken(): string | undefined {
  return process.env.ADMIN_MOCK_TOKEN;
}

export function getPort(): number {
  const port = Number(process.env.PORT);
  return Number.isFinite(port) && port > 0 ? port : 3000;
}
