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

        this.endpoints = require('../resources/endpoints.json');

        this.urlGauge = new prometheus.Gauge({
            name: 'up_down',
            help: 'Shows if a url is up or down',
            labelNames: ['name', 'url']
        })
    }

    check() {
        setInterval( () => {
            this.endpoints.urls.forEach(url => {
                this.checkUrl(url);
            })
        }, 30000 );

        return true
    }

    checkUrl(url) {
        axios.get(url.url)
        .then(response => {
            console.log(`+++ url ${url.url} is up`);
            this.urlGauge.labels("example", url.url).set(1);
        })
        .catch(error => {
            console.log(`--- url ${url.url} is down`);
            this.urlGauge.labels("example", url.url).set(0)
        })
    }
}

module.exports = new Health();