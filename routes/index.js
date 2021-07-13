var express = require('express');
var router = express.Router();
const Deployment = require('../models/Deployment');

/* GET home page. */
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

    res.render('index', { title: 'Projects deployments', deployments: deployments });
});

module.exports = router;