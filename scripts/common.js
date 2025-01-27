const path = require('node:path');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  keyFilename: path.join(process.cwd(), 'service-account.json'),
});
module.exports.bucket = storage.bucket('songpb_secrets');
