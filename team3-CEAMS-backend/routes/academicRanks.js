//academic-ranks.js
var express = require('express');
var router = express.Router();

var AcademicRanks = require('../models/academic-ranks');

/* GET all */
router.get('/', function(req, res) {
    AcademicRanks.Model.find((err, academicRanks) => {
        if (err) res.status(500).json(err);
        res.json({academicRank: academicRanks});
    });
});

/* GET some */
router.get('/:id', function(req, res) {
    AcademicRanks.Model.findById(req.params.id, function (err, academicRank) {
        if (err) res.status(500).json(err);
        else res.json({academicRank: academicRank});
    });
});

/* POST */
router.post('/', function(req, res) {
    var academicRank = new AcademicRanks.Model(req.body.academicRank);
    academicRank.save(function (err) {
        if (err) res.status(500).json(err);
        res.json({academicRank: academicRank});
    });
});

/* PUT */
router.put('/:id', function(req, res) {
    AcademicRanks.Model.findById(req.params.id, function (err, academicRank) {
        if (err) res.status(500).json(err);
        else {
            academicRank.code = req.body.academicRank.code;
            academicRank.name = req.body.academicRank.name;
            academicRank.instructors = req.body.academicRank.instructors;
            academicRank.save(function (err) {
                if (err) res.status(500).json(err);
                else {
                    res.json({academicRank: academicRank});
                }
            });
        }
    });
});

/* DELETE */
router.delete('/:id', function(req, res) {
    AcademicRanks.Model.findOneAndDelete({_id: req.params.id},
        function (err, deleted) {
            if (err) res.status(500).json(err);
            else {
                res.json({licenceStatus: deleted});
            }
        }
    );
});

module.exports = router;