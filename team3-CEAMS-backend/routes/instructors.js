var express = require('express');
var router = express.Router();

var Instructors = require('../models/instructors');

/* GET all */
router.get('/', function (req, res) {
  Instructors.Model.find().populate('memberships').exec((err, instructors) => {
    if (err) res.status(500).json(err);
    res.json({ instructor: instructors });
  });
});

/* GET some */
router.get('/:id', function (req, res) {
  Instructors.Model.findById(req.params.id, function (err, instructor) {
    if (err) res.status(500).json(err);
    else res.json({ instructor: instructor });
  });
});

/* POST */
router.post('/', function (req, res) {
  var instructor = new Instructors.Model(req.body.instructor);
  instructor.save(function (err) {
    if (err) res.status(500).json(err);
    res.json({ instructor: instructor });
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  Instructors.Model.findById(req.params.id, function (err, instructor) {
    if (err) res.status(500).json(err);
    else {
        instructor.firstName = req.body.instructor.firstName;
        instructor.lastName = req.body.instructor.lastName;
        instructor.email = req.body.instructor.email;
        instructor.building = req.body.instructor.building;
        instructor.officeNumber = req.body.instructor.officeNumber;
        instructor.number = req.body.instructor.number;
        instructor.ccMemberStatus = req.body.instructor.ccMemberStatus;
        instructor.hireDate = req.body.instructor.hireDate;
        instructor.estimatedRetirementDate = req.body.instructor.estimatedRetirementDate;
        instructor.keyPerformanceIndicator = req.body.instructor.keyPerformanceIndicator;
        instructor.gender = req.body.instructor.gender;
        instructor.evaluationMethod = req.body.instructor.evaluationMethod;
        instructor.programs = req.body.instructor.programs;
        instructor.licenceProviders = req.body.instructor.licenceProviders;
        instructor.degreeProviders = req.body.instructor.degreeProviders;
        instructor.rank = req.body.instructor.rank;
        instructor.semesters = req.body.instructor.semesters;
        instructor.memberships = req.body.instructor.memberships;
        instructor.userShadow = req.body.instructor.userShadow;

        instructor.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({instructor: instructor});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function (req, res) {
  Instructors.Model.findOneAndDelete({ _id: req.params.id },
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        res.json({ instructor: deleted });
      }
    }
  );
});

module.exports = router;