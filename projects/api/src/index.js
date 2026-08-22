import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  NODE_ENV,
  PORT,
  REQUEST_TIMEOUT,
  HEADERS_TIMEOUT,
  KEEP_ALIVE_TIMEOUT,
  SERVER_TIMEOUT,
  MONGODB_URL,
  MONGODB_DB_NAME,
} from './config/index.js';
import STATUS_CODES from './constants/status-codes.js';
import { auth, cabinet, category, song } from './routes/index.js';
import logger from './services/logging.js';
import errorHandler from './middlewares/error-handler.js';
import requestLogger from './middlewares/request-logger.js';
import authMiddleware from './middlewares/auth-check.js';
import path from 'node:path';

const app = express();

app.enable('trust proxy');
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
if (NODE_ENV === 'production') {
  app.use(
    helmet({
      hsts: false,
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'upgrade-insecure-requests': null,
        },
      },
    })
  );
}
app.use(
  cors({
    origin: '*',
  })
);
app.use(compression());
app.use(cookieParser());
app.use(requestLogger);

app.get('/ping', (req, res) => res.status(STATUS_CODES.OK).send());

app.use('/api/auth', auth);
app.use('/api/cabinet', authMiddleware, cabinet);
app.use('/api/category', category);
app.use('/api/song', song);

const clientPath = path.join(
  import.meta.dirname,
  '..',
  '..',
  'client',
  'public'
);
app.use(express.static(clientPath));

app.get(/^\/(?!api(?:\/|$)).*/, (_req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.use(errorHandler);

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URL, {
      dbName: MONGODB_DB_NAME,
    });
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    server.requestTimeout = REQUEST_TIMEOUT;
    server.headersTimeout = HEADERS_TIMEOUT;
    server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT;
    server.setTimeout(SERVER_TIMEOUT);
  } catch (err) {
    logger.error(err);
  }
};

start();

process
  .on('unhandledRejection', (err, _p) => {
    logger.error(err);
  })
  .on('uncaughtException', async err => {
    logger.error(err);
    logger.error('!= () APP shutdown ');
    await mongoose.disconnect();
    process.exit(1);
  })
  .on('SIGINT', async () => {
    logger.warn('Received SIGINT. Closing connections...');
    await mongoose.disconnect();
    process.exit(1);
  })
  .on('SIGTERM', async () => {
    logger.warn('Received SIGTERM. Closing connections...');
    await mongoose.disconnect();
    process.exit(1);
  });
