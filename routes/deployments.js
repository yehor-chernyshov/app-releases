const express = require('express');
const router = express.Router();
const Deployment = require('../models/Deployment');


// Create wrapper function that will adjust router based on provided configuration
const wrapper = function(apiWriteTokenAuthenticate, apiReadTokenAuthenticate, webhooks = []) {

    router.get('/', apiReadTokenAuthenticate, async function(req, res, next) {
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

    router.post('/', apiWriteTokenAuthenticate, async function(req, res, next) {
        const newDeploment = new Deployment({
            projectName: req.body.projectName,
            tag: req.body.tag,
            commitHash: req.body.commitHash,
            branch: req.body.branch,
            env: req.body.env
        });
        newDeploment.save(function(error, document) {
            if (error) {
                res.status(400).json(error);
            }
            webhooks.forEach(webhook => webhook.send(document));
            res.json(document);
        })
    });

    router.post('/heroku', apiWriteTokenAuthenticate, async function(req, res, next) {
        if (req.body.data.status === "succeeded" &&
            req.body.action == "create" &&
            req.body.resource == "release") {
            const newDeploment = new Deployment({
                projectName: req.body.data.app.name,
                commitHash: req.body.data.slug.commit,
                env: req.query.env
            });
            newDeploment.save(function(error, document) {
                if (error) {
                    res.json(error);
                }
                webhooks.forEach(webhook => webhook.send(document));
                res.json(document);
            })
        }

    });

    return router;
}

module.exports = wrapper;