// server.js
const express = require('express');
const https = require('http');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'service-worker.js'));
});

app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const sendMessage = () => {
    res.write(`data: ${new Date().toLocaleTimeString()}\n\n`);
  };

  const intervalId = setInterval(sendMessage, 5000);

  req.on('close', () => {
    clearInterval(intervalId);
  });
});

https.createServer(app).listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});