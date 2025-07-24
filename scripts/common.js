import { Storage } from '@google-cloud/storage';

// use the default project and credentials otherwise set the environment variable GOOGLE_APPLICATION_CREDENTIALS
const storage = new Storage();

export const bucket = storage.bucket('songpb_secrets');
