const express = require('express');
const router = express.Router();
const Deployment = require('../models/Deployment');


// Create wrapper function that will adjust router based on provided configuration
const wrapper = function(token, webhooks = []) {

    function apiTokenAuthenticate(req, res, next) {
        const token = req.headers['authorization'];
        if (token == null || token !== token) {
            return res.sendStatus(401)
        }
        next()
    }

    router.get('/', async function(req, res, next) {
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

    router.post('/', apiTokenAuthenticate, async function(req, res, next) {
        const newDeploment = new Deployment({
            projectName: req.body.projectName,
            tag: req.body.tag,
            commitHash: req.body.commitHash,
            branch: req.body.branch,
            env: req.body.env
        });
        newDeploment.save(function(error, document) {
            if (error) {
                res.json(error);
            }
            webhooks.forEach(webhook => webhook.send(document));
            res.json(document);
        })
    });

    return router;
}

module.exports = wrapper;