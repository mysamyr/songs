/* eslint-disable no-console */
const path = require('node:path');
const fs = require('node:fs');
const { TransferManager } = require('@google-cloud/storage');
const { bucket } = require('./common');

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
