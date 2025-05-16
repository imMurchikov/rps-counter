const express = require('express');
const app = express();
const port = 3000;

let requestCount = 0;
let lastCalculationTime = Date.now();
let currentRPS = 0;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use((req, res, next) => {
    requestCount++;
    const now = Date.now();
    const elapsedSeconds = (now - lastCalculationTime) / 1000;
    if (elapsedSeconds >= 1) {
        currentRPS = Math.round(requestCount / elapsedSeconds);
        requestCount = 0;
        lastCalculationTime = now;
    }
    next();
});

app.get('/api/request', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(`RPS: ${currentRPS}`);
});

app.listen(port);