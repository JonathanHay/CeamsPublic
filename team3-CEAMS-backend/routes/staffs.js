var express = require('express');
var router = express.Router();

var Staffs = require('../models/staffs');

/* GET all */
router.get('/', function(req, res) {
  Staffs.Model.find().populate('memberships').exec((err, staffs) => {
    if (err) res.status(500).json(err);
    res.json({staff: staffs});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  Staffs.Model.findById(req.params.id, function (err, staff) {
    if (err) res.status(500).json(err);
    else res.json({staff: staff});
  });
});

/* POST */
router.post('/', function(req, res) {
  var staff = new Staffs.Model(req.body.staff);
  staff.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({staff: staff});
  });
});

/* PUT */
// router.put('/:id', function(req, res) {
//   Staffs.Model.findById(req.params.id, function (err, staff) {
//     if (err) res.status(500).json(err);
//     else {
//         staff.code = req.body.staff.code;
//         staff.name = req.body.staff.name;
//         staff.save(function (err) {
//             if (err) res.status(500).json(err);
//             else {
//                 res.json({staff: staff});
//             }
//         });
//     }
//   });
// });

/* DELETE */
router.delete('/:id', function(req, res) {
  Staffs.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        res.json({staff: deleted});
      }
    }
);
});

module.exports = router;