const prometheus = require('prom-client');
const https = require('https');
const axios = require('axios').create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

class Health {
    constructor(){
        if(Health.instance) {
            return Health.instance;
        }

        prometheus.collectDefaultMetrics({ register: new prometheus.Registry(), timeout: 5000 });
        prometheus.register.setDefaultLabels({app: 'synthetic-monitor'});

        this.services = require('../resources/endpoints.js');

        this.EndPointGauge = new prometheus.Gauge({
            name: 'up_down',
            help: 'Shows if an endpoint is up or down',
            labelNames: ['name', 'type', 'environment', 'region']
        })
    }


}