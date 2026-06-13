import { join } from 'node:path';
import { loadEnvFile } from 'node:process';

import logger from '../services/logging.js';

try {
  loadEnvFile(join(import.meta.dirname, '..', '..', '.env'));
} catch (e) {
  if (e.code === 'ENOENT')
    logger.warn('No .env file found or could not be loaded.');
}
