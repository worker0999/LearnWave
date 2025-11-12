const http = require('http');
const jwt = require('jsonwebtoken');

// Create a fake but valid JWT token
const fakeToken = jwt.sign({ userId: 'test-user', role: 'STUDENT' }, 'fake-secret', { expiresIn: '1h' });

const postData = JSON.stringify({
  message: 'What is machine learning?',
  context: 'academic_help'
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/ai/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Authorization': `Bearer ${fakeToken}`
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}\n`);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response body:');
    console.log(data);
  });
});

req.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

req.write(postData);
req.end();
