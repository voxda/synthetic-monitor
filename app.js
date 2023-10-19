const express = require('express');
const prometheus = require('prom-client');
const Health = require('./services/health');

// Create an express app
const app = express();

// Expose the Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
    try {
        const metrics = await prometheus.register.metrics();
        res.set('Content-Type', prometheus.register.contentType);
        res.end(metrics);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

Health.check();
console.log('health check started');

// Start the express app
app.listen(3001, () => {
    console.log('Server listening on port 3001');
});