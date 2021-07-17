const express = require('express');
const router = express.Router();
const Deployment = require('../src/models/Deployment');


// Create wrapper function that will adjust router based on provided configuration
const wrapper = function(auth, webhooks = []) {

    router.get('/', auth.apiReadTokenAuthenticate(), async function(req, res, next) {
        const deployments = await Deployment.aggregate([{
            $group: {
                _id: "$projectName",
                projectName: { $last: "$projectName" },
                env: { $last: "$env" },
                commitHash: { $last: "$commitHash" },
                tag: { $last: "$tag" },
                branch: { $last: "$branch" },
                date: { $last: "$date" },
            }
        }]).sort({ projectName: 1 });

        res.json(deployments);
    });

    router.post('/', auth.apiWriteTokenAuthenticate(), async function(req, res, next) {
        new Deployment(req.body)
            .save(function(error, document) {
                if (error) {
                    res.status(400).json(error);
                }
                webhooks.forEach(webhook => webhook.send(document));
                res.json(document);
            })
    });

    router.post('/heroku', auth.apiWriteTokenAuthenticate(), async function(req, res, next) {
        if (req.body.data.status === "succeeded" &&
            req.body.action == "create" &&
            req.body.resource == "release") {
            new Deployment({
                projectName: req.body.data.app.name,
                commitHash: req.body.data.slug.commit,
                env: req.query.env
            }).save(function(error, document) {
                if (error) {
                    res.status(400).json(error);
                }
                webhooks.forEach(webhook => webhook.send(document));
                res.json(document);
            })
        }
        res.status(400);
    });

    return router;
}

module.exports = wrapper;