/* eslint-disable no-console */
import path from 'node:path';
import fs from 'node:fs';
import { TransferManager } from '@google-cloud/storage';
import { bucket } from './common.js';

const env = process.argv[2];
if (!env) throw Error("Environment doesn't exist");

const transferManager = new TransferManager(bucket);

(async () => {
  fs.mkdirSync(path.join(process.cwd(), 'assets', env, 'initdb'), {
    recursive: true,
  });
  await transferManager.downloadManyFiles(env, {
    passthroughOptions: {
      destination: 'assets',
    },
  });

  console.log('Secrets were fetched');
})();
