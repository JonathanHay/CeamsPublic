var express = require('express');
var router = express.Router();

var TeachingAssistants = require('../models/teachingAssistants');

/* GET all */
router.get('/', async function(req, res) {
  TeachingAssistants.Model.find((err, teachingAssistants) => {
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
router.put('/:id', function(req, res) {
  TeachingAssistants.Model.findById(req.params.id, function (err, teachingAssistant) {
    if (err) return res.status(500).json(err);
    else {
        teachingAssistant.code = req.body.teachingAssistant.code;
        teachingAssistant.firstName = req.body.teachingAssistant.firstName;
        teachingAssistant.lastName = req.body.teachingAssistant.lastName;
        teachingAssistant.email = req.body.teachingAssistant.email;
        teachingAssistant.building = req.body.teachingAssistant.building;
        teachingAssistant.officeNumber = req.body.teachingAssistant.officeNumber;
        teachingAssistant.contractInfo = req.body.teachingAssistant.contractInfo;
        teachingAssistant.memberships = req.body.teachingAssistant.memberships;
        teachingAssistant.userShadow = req.body.teachingAssistant.userShadow;
        teachingAssistant.save(function (err) {
            if (err) return res.status(500).json(err);
            else {
                res.json({teachingAssistant: teachingAssistant});
            }
        });
    }
  });
});

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