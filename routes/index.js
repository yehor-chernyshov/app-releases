const express = require('express');
const router = express.Router();
const Deployment = require('../src/models/Deployment');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const demo = {
        tokens: {
            read: process.env.DEMO_API_READ_TOKEN || null,
            write: process.env.DEMO_API_WRITE_TOKEN || null,
        },
        api_docs_enabled: process.env.SHOW_API_DOCS || false
    };
    res.render('index', { title: 'Project deployments | Free tool', demo: demo });
});

module.exports = router;