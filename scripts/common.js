import '../projects/api/src/utils/dotenv.js';
import { Storage } from '@google-cloud/storage';

if (!process.env.PROJECT_ID) {
  throw new Error('Project ID is required');
}

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
});

export const bucket = storage.bucket('songpb_secrets');
