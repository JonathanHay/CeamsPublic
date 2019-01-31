var express = require('express');
var router = express.Router();

var CourseTypes = require('../models/course-types');

/* GET all */
router.get('/', function(req, res) {
  CourseTypes.Model.find((err, courseTypes) => {
    if (err) res.status(500).json(err);
    res.json({courseType: courseTypes});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  CourseTypes.Model.findById(req.params.id, function (err, courseType) {
    if (err) res.status(500).json(err);
    else res.json({courseType: courseType});
  });
});

/* POST */
router.post('/', function(req, res) {
  var courseType = new CourseTypes.Model(req.body.courseType);
  courseType.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({courseType: courseType});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  CourseTypes.Model.findById(req.params.id, function (err, courseType) {
    if (err) res.status(500).json(err);
    else {
        courseType.code = req.body.courseType.code;
        courseType.name = req.body.courseType.name;
        courseType.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({courseType: courseType});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function(req, res) {
  CourseTypes.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        res.json({courseType: deleted});
      }
    }
);
});

module.exports = router;