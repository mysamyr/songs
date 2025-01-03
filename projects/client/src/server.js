/* eslint-disable no-console */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const getContentType = url => {
  const ext = url.split(/[#?]/)[0].split('.').pop().trim();
  switch (ext) {
    case 'html':
      return 'text/html';
    case 'ico':
      return 'image/x-icon';
    case 'js':
      return 'text/javascript';
    case 'css':
      return 'text/css';
    case 'png':
      return 'image/png';
    case 'json':
      return 'application/json';
    default:
      return 'text/plain';
  }
};

const server = http.createServer((request, response) => {
  console.log({
    level: 'info',
    message: JSON.stringify({
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    }),
  });

  if (request.url.startsWith('/api')) {
    // call API
    const [, , ...rest] = request.url.split('/');
    const url = '/' + rest.join('/');
    const proxy = http.request(
      {
        hostname: process.env.HOST || '127.0.0.1',
        port: 8080,
        path: url,
        method: request.method,
        headers: request.headers,
      },
      res => {
        response.writeHead(res.statusCode, res.headers);
        res.pipe(response, {
          end: true,
        });
      }
    );

    proxy.on('error', err => {
      console.log('error', err);
      response.end();
    });

    request.pipe(proxy, {
      end: true,
    });
  } else if (request.url === '/ping') {
    response.statusCode = 200;
    response.end();
  } else {
    // get static files
    const staticFiles = [
      '/favicon.ico',
      '/index.js',
      '/styles.css',
      '/styles.min.css',
    ];

    if (staticFiles.includes(request.url)) {
      fs.readFile(
        path.join(__dirname, '..', 'public', request.url),
        'utf8',
        (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          response.statusCode = 200;
          response.setHeader('Content-Type', getContentType(request.url));
          response.end(data);
        }
      );
    } else {
      // return index.html
      fs.readFile(
        path.join(__dirname, '..', 'public', 'index.html'),
        'utf8',
        (err, data) => {
          if (err) {
            console.error(err);
            response.statusCode = 500;
            response.setHeader('Content-Type', 'text/html');
            response.end(
              `<h1>Unexpected error occurred! Please, try again later</h1>`
            );
            return;
          }
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/html');
          response.end(data);
        }
      );
    }
  }
});

server.listen(3000, () => console.log('Listening port 3000'));
