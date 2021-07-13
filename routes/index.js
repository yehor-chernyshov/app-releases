var express = require('express');
var router = express.Router();
const Release = require('../models/Release');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const releases = await Release.aggregate([{
        $group: {
            _id: "$projectName",
            projectName: { $last: "$projectName" },
            commitHash: { $last: "$commitHash" },
            tag: { $last: "$tag" },
            branch: { $last: "$branch" },
            date: { $last: "$date" },
        }
    }]).sort({ projectName: 1 });

    res.render('index', { title: 'Projects', releases: releases });
});

module.exports = router;