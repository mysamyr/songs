/* eslint-disable no-console */
import path from 'node:path';
import fs from 'node:fs';

const env = process.argv[2];
if (!env) throw Error("Environment doesn't exist");

const folderPath = path.join(process.cwd(), 'assets', env);

if (!fs.existsSync(folderPath))
  throw new Error(`Folder ${folderPath} does not exist`);

fs.readdirSync(path.join(folderPath)).forEach(file => {
  if (file === 'initdb') {
    fs.cpSync(
      path.join(folderPath, file),
      path.join(process.cwd(), 'assets', file),
      { recursive: true }
    );
  } else if (file === '.env') {
    fs.copyFileSync(
      path.join(folderPath, file),
      path.join(process.cwd(), file)
    );
  }
});

console.log('Secrets were copied');
