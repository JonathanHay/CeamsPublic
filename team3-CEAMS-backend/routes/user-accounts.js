var express = require('express');
var router = express.Router();

var UserAccounts = require('../models/userAccounts');

/* GET all */
router.get('/', function(req, res) {
  UserAccounts.Model.find((err, userAccounts) => {
    if (err) res.status(500).json(err);
    res.json({userAccount: userAccounts});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  UserAccounts.Model.findById(req.params.id, function (err, userAccount) {
    if (err) res.status(500).json(err);
    else res.json({userAccount: userAccount});
  });
});

/* POST */
router.post('/', function(req, res) {
  var userAccount = new UserAccounts.Model(req.body.userAccount);
  userAccount.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({userAccount: userAccount});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  UserAccounts.Model.findById(req.params.id, function (err, userAccount) {
    if (err) res.status(500).json(err);
    else {
        userAccount.username = req.body.userAccount.username;
        userAccount.encryptedPassword = req.body.userAccount.encryptedPassword;
        userAccount.salt = req.body.userAccount.salt;
        userAccount.userAccountExpiryDate = req.body.userAccount.userAccountExpiryDate;
        userAccount.passwordMustChanged = req.body.userAccount.passwordMustChanged;
        userAccount.passwordReset = req.body.userAccount.passwordReset;
        userAccount.instructor = req.body.userAccount.instructor;
        userAccount.staff = req.body.userAccount.staff;
        userAccount.teachingAssistant = req.body.userAccount.teachingAssistant;
        userAccount.userGivenRoles = req.body.userAccount.userGivenRoles;
        userAccount.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({userAccount: userAccount});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function(req, res) {
  UserAccounts.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        res.json({userAccount: deleted});
      }
    }
);
});

module.exports = router;