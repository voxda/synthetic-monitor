const express = require('express');
const prometheus = require('prom-client');
const Health = require('./services/health');

// Create an express app
const app = express();

// Define a route that returns a JSON response
app.get('/check', async (req, res) => {
    try {
        //const health = new Health();
        Health.check();
        res.json({ message: 'health check started' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

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

// expose a health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});

// Start the express app
app.listen(3001, () => {
    console.log('Server listening on port 3001');
});