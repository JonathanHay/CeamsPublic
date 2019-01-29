var express = require('express');
var router = express.Router();

var AcademicYear = require('../models/academic-years');

/* GET all */
router.get('/', function(req, res) {
  AcademicYear.Model.find((err, utils) => {
    if (err) res.status(500).json(err);
    res.json(utils);
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  AcademicYear.Model.findById(req.params.id, function (err, academicYear) {
    if (err) res.status(500).json(err);
    else res.json({academicYear: academicYear});
  });
});

/* POST */
router.post('/', function(req, res) {
  var academicYear = new AcademicYear.Model(req.body.academicYear);
  academicYear.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({academicYear: academicYear});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  AcademicYear.Model.findById(req.params.id, function (err, academicYear) {
    if (err) res.status(500).json(err);
    else {
        academicYear.code = req.body.academicYear.code;
        academicYear.name = req.body.academicYear.name;
        academicYear.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({academicYear: academicYear});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function(req, res) {
  AcademicYear.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        response.json({academicYear: deleted});
      }
    }
);
});

module.exports = router;