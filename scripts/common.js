import path from 'node:path';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  keyFilename: path.join(process.cwd(), 'service-account.json'),
});

export const bucket = storage.bucket('songpb_secrets');
