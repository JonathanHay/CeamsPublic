var express = require('express');
var router = express.Router();

var AcademicYears = require('../models/academic-years');

/* GET all */
router.get('/', function(req, res) {
  AcademicYears.Model.find((err, academicYears) => {
    if (err) res.status(500).json(err);
    res.json({academicYear: academicYears});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  AcademicYears.Model.findById(req.params.id, function (err, academicYear) {
    if (err) res.status(500).json(err);
    else res.json({academicYear: academicYear});
  });
});

/* POST */
router.post('/', function(req, res) {
  var academicYear = new AcademicYears.Model(req.body.academicYear);
  academicYear.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({academicYear: academicYear});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  AcademicYears.Model.findById(req.params.id, function (err, academicYear) {
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
  AcademicYears.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        res.json({academicYear: deleted});
      }
    }
);
});

module.exports = router;