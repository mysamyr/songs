import './utils/dotenv.js';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import STATUS_CODES from './constants/status-codes.js';
import { auth, cabinet, category, song } from './routes/index.js';
import logger from './services/logging.js';
import errorHandler from './middlewares/error-handler.js';
import requestLogger from './middlewares/request-logger.js';

const PORT = +process.env.PORT;
const REQUEST_TIMEOUT = +process.env.REQUEST_TIMEOUT || 5000;
const HEADERS_TIMEOUT = +process.env.HEADERS_TIMEOUT || 2000;
const KEEP_ALIVE_TIMEOUT = +process.env.KEEP_ALIVE_TIMEOUT || 3000;
const SERVER_TIMEOUT = +process.env.SERVER_TIMEOUT || 60000;

const app = express();

app.enable('trust proxy');
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(requestLogger);

app.get('/ping', (req, res) => res.status(STATUS_CODES.OK).send());

app.use('/auth', auth);
app.use('/cabinet', cabinet);
app.use('/category', category);
app.use('/song', song);

app.use(errorHandler);

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_DB_NAME,
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
  .on('unhandledRejection', err => {
    logger.error(err);
  })
  .on('uncaughtException', async err => {
    logger.error(err);
    logger.error('!= () APP shutdown ');
    await mongoose.disconnect();
    process.exit(1);
  })
  .on('SIGINT', async () => {
    logger.log('Received SIGINT. Closing connections...');
    await mongoose.disconnect();
    process.exit(0);
  })
  .on('SIGTERM', async () => {
    logger.log('Received SIGTERM. Closing connections...');
    await mongoose.disconnect();
    process.exit(0);
  });
