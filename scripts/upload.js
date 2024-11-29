/* eslint-disable no-console */
import path from 'node:path';
import fs from 'node:fs';
import { bucket } from './common.js';

const env = process.argv[2];
if (!env) throw Error("Environment doesn't exist");

const directoryPath = path.join(process.cwd(), 'assets', env);

const uploadFile = filePath => {
  const destination = path
    .join(env, path.relative(directoryPath, filePath))
    .replaceAll(path.sep, path.posix.sep);
  bucket
    .upload(path.join(filePath), {
      destination,
    })
    .then(() => console.log(`${destination} uploaded!`));
};

const readDir = dir => {
  for (let file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      readDir(filePath);
    } else {
      uploadFile(filePath);
    }
  }
};

readDir(directoryPath);
