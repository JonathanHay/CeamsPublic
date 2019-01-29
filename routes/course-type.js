var express = require('express');
var router = express.Router();

var CourseType = require('../models/course-types');

/* GET all */
router.get('/', function(req, res) {
  CourseType.Model.find((err, utils) => {
    if (err) res.status(500).json(err);
    res.json(utils);
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  CourseType.Model.findById(req.params.id, function (err, courseType) {
    if (err) res.status(500).json(err);
    else res.json({courseType: courseType});
  });
});

/* POST */
router.post('/', function(req, res) {
  var courseType = new CourseType.Model(req.body.courseType);
  courseType.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({courseType: courseType});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  CourseType.Model.findById(req.params.id, function (err, courseType) {
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
  CourseType.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        response.json({courseType: deleted});
      }
    }
);
});

module.exports = router;