import cron from 'node-cron';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { promisify } from 'node:util';

const gzip = promisify(zlib.gzip);
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/songpb';
const BACKUP_DIR = path.join(process.cwd(), 'backups');

async function ensureConnected() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

async function backupCollections() {
  await ensureConnected();

  const songs = await mongoose.connection
    .collection('songs')
    .find({})
    .toArray();
  const categories = await mongoose.connection
    .collection('categories')
    .find({})
    .toArray();

  const payload = {
    createdAt: new Date().toISOString(),
    collections: {
      songs,
      categories,
    },
  };

  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-songs-categories-${timestamp}.json.gz`;

  const json = JSON.stringify(payload, null, 2);
  const compressed = await gzip(json);

  await fs.writeFile(path.join(BACKUP_DIR, filename), compressed);
  console.log(`[backup] saved`);
}

cron.schedule(
  '0 0 * * *',
  () => {
    backupCollections().catch(err => {
      console.error('[backup] failed', err);
    });
  },
  {
    scheduled: true,
    timezone: 'UTC',
  }
);

// Optional: run once on startup
backupCollections().catch(err => {
  console.error('[backup] startup run failed', err);
});
