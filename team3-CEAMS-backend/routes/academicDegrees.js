//academic-degrees.js
var express = require('express');
var router = express.Router();

var AcademicDegrees = require('../models/academic-degrees');

/* GET all */
router.get('/', function(req, res) {
    AcademicDegrees.Model.find((err, academicDegrees) => {
        if (err) res.status(500).json(err);
        res.json({academicDegree: academicDegrees});
    });
});

/* GET some */
router.get('/:id', function(req, res) {
    AcademicDegrees.Model.findById(req.params.id, function (err, academicDegree) {
        if (err) res.status(500).json(err);
        else res.json({academicDegree: academicDegree});
    });
});

/* POST */
router.post('/', function(req, res) {
    var academicDegree = new AcademicDegrees.Model(req.body.academicDegree);
    academicDegree.save(function (err) {
        if (err) res.status(500).json(err);
        res.json({academicDegree: academicDegree});
    });
});

/* PUT */
router.put('/:id', function(req, res) {
    AcademicDegrees.Model.findById(req.params.id, function (err, academicDegree) {
        if (err) res.status(500).json(err);
        else {
            academicDegree.code = req.body.academicDegree.code;
            academicDegree.name = req.body.academicDegree.name;
            academicDegree.degreeProviders = req.body.academicDegree.degreeProviders;
            academicDegree.save(function (err) {
                if (err) res.status(500).json(err);
                else {
                    res.json({academicDegree: academicDegree});
                }
            });
        }
    });
});

/* DELETE */
router.delete('/:id', function(req, res) {
    AcademicDegrees.Model.findOneAndDelete({_id: req.params.id},
        function (err, deleted) {
            if (err) res.status(500).json(err);
            else {
                res.json({academicDegree: deleted});
            }
        }
    );
});

module.exports = router;