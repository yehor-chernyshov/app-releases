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
        new Deployment({...req.query, ...req.body })
            .save(function(error, document) {
                if (error) {
                    res.status(400).json(error);
                } else {
                    webhooks.forEach(webhook => {
                        try {
                            webhook.send(document);
                        } catch (e) {
                            console.log(e)
                        }
                    });
                    res.json(document);
                }
            })
    });

    router.post('/heroku', auth.apiWriteTokenAuthenticate(), async function(req, res, next) {
        if (req.body.data.status === "succeeded" &&
            req.body.action == "create" &&
            req.body.resource == "release") {
            const deployment = req.query;
            deployment.projectName = req.body.data.app.name;
            deployment.commitHash = req.body.data.slug.commit;
            new Deployment(deployment).save(function(error, document) {
                if (error) {
                    res.status(400).json(error);
                } else {
                    webhooks.forEach(webhook => {
                        try {
                            webhook.send(document);
                        } catch (e) {
                            console.log(e)
                        }
                    });
                    res.json(document);
                }
            })
        }
        res.status(400);
    });

    return router;
}

module.exports = wrapper;