var express = require('express');
var router = express.Router();

var TeachingAssistants = require('../models/teachingAssistants');

/* GET all */
router.get('/', async function (req, res) {
  TeachingAssistants.Model.find().populate('memberships').exec((err, teachingAssistants) => {
    if (err) res.status(500).json(err);
    res.json({ teachingAssistant: teachingAssistants });
  });
});

/* GET some */
router.get('/:id', function (req, res) {
  TeachingAssistants.Model.findById(req.params.id, function (err, teachingAssistant) {
    if (err) res.status(500).json(err);
    else res.json({ teachingAssistant: teachingAssistant });
  });
});

/* POST */
router.post('/', function (req, res) {
  var teachingAssistant = new TeachingAssistants.Model(req.body.teachingAssistant);
  teachingAssistant.save(function (err) {
    if (err) res.status(500).json(err);
    res.json({ teachingAssistant: teachingAssistant });
  });
});

/* PUT */
// router.put('/:id', function(req, res) {
//   TeachingAssistants.Model.findById(req.params.id, function (err, teachingAssistant) {
//     if (err) res.status(500).json(err);
//     else {
//         teachingAssistant.code = req.body.teachingAssistant.code;
//         teachingAssistant.name = req.body.teachingAssistant.name;
//         teachingAssistant.save(function (err) {
//             if (err) res.status(500).json(err);
//             else {
//                 res.json({teachingAssistant: teachingAssistant});
//             }
//         });
//     }
//   });
// });

/* DELETE */
router.delete('/:id', function (req, res) {
  TeachingAssistants.Model.findOneAndDelete({ _id: req.params.id },
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        res.json({ teachingAssistant: deleted });
      }
    }
  );
});

module.exports = router;