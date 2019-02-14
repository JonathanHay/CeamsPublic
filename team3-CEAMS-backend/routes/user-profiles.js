var express = require('express');
var router = express.Router();

var UserProfile = require('../models/user-profiles');

/* GET all */
router.get('/', function(req, res) {
  UserProfile.Model.find((err, userProfiles) => {
    if (err) res.status(500).json(err);
    res.json({userProfile: userProfiles});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  UserProfile.Model.findById(req.params.id, function (err, userProfile) {
    if (err) res.status(500).json(err);
    else res.json({userProfile: userProfile});
  });
});

/* POST */
router.post('/', function(req, res) {
  var userProfile = new UserProfile.Model(req.body.userProfile);
  userProfile.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({userProfile: userProfile});
  });
});

module.exports = router;