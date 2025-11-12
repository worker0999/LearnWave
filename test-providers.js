#!/usr/bin/env node

const http = require('http');
const url = require('url');

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/ai/providers',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

console.log('Calling GET /api/ai/providers...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

req.end();
