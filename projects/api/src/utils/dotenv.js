import { join } from 'node:path';
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile(join(import.meta.dirname, '..', '..', '..', '..', '.env'));
} catch (e) {
  if (e.code === 'ENOENT')
    // eslint-disable-next-line no-console
    console.warn('No .env file found or could not be loaded.');
}
