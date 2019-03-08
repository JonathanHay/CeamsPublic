var express = require('express');
var router = express.Router();

var Instructors = require('../models/instructors');

/* GET all */
router.get('/', function(req, res) {
  Instructors.Model.find((err, instructors) => {
    if (err) res.status(500).json(err);
    res.json({instructor: instructors});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  Instructors.Model.findById(req.params.id, function (err, instructor) {
    if (err) res.status(500).json(err);
    else res.json({instructor: instructor});
  });
});

/* POST */
router.post('/', function(req, res) {
  var instructor = new Instructors.Model(req.body.instructor);
  instructor.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({instructor: instructor});
  });
});

/* PUT */
// router.put('/:id', function(req, res) {
//   Instructors.Model.findById(req.params.id, function (err, instructor) {
//     if (err) res.status(500).json(err);
//     else {
//         instructor.code = req.body.instructor.code;
//         instructor.name = req.body.instructor.name;
//         instructor.save(function (err) {
//             if (err) res.status(500).json(err);
//             else {
//                 res.json({instructor: instructor});
//             }
//         });
//     }
//   });
// });

/* DELETE */
router.delete('/:id', function(req, res) {
  Instructors.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        res.json({instructor: deleted});
      }
    }
);
});

module.exports = router;