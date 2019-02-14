var express = require('express');
var router = express.Router();

var MemberAttendingMeeting = require('../models/members-attending-meeting');
var UserProfile = require('../models/user-profiles');


/* GET all */
router.get('/', function (req, res) {
  MemberAttendingMeeting.Model.find((err, membersAttendingMeeting) => {
    if (err) res.status(500).json(err);
    res.json({ memberAttendingMeeting: membersAttendingMeeting });
  });
});

/* GET some */
router.get('/:id', function (req, res) {
  MemberAttendingMeeting.Model.findById(req.params.id, function (err, memberAttendingMeeting) {
    if (err) res.status(500).json(err);
    else res.json({ memberAttendingMeeting: memberAttendingMeeting });
  });
});

/* POST */
router.post('/', function (req, res) {
  var member = new MemberAttendingMeeting.Model(req.body.memberAttendingMeeting);
  member.save(function (err) {
    if (err) res.status(500).json(err);
    //saving the ID of the meeting minutes inside the meeting that it represents
    UserProfile.Model.findById(req.body.memberAttendingMeeting.userProfile, function (err, userProfile) {
      if (err) res.status(500).json(err);
      else {
        userProfile.memberAttendingMeeting.push(member._id); 
        userProfile.save(function (err) {
          if (err) res.status(500).json(err);
        });
      }
    });
    res.json({ memberAttendingMeeting: member });
  });
});

/* PUT */
router.put('/:id', function (req, res) {
  MemberAttendingMeeting.Model.findById(req.params.id, function (err, memberAttendingMeeting) {
    if (err) res.status(500).json(err);
    else {
      memberAttendingMeeting.participationStartDate = req.body.memberAttendingMeeting.participationStartDate;
      memberAttendingMeeting.participationEndDate = req.body.memberAttendingMeeting.participationEndDate;
      memberAttendingMeeting.memberRole = req.body.memberAttendingMeeting.memberRole;
      memberAttendingMeeting.committeeName = req.body.memberAttendingMeeting.committeeName;
      memberAttendingMeeting.committeeLevel = req.body.memberAttendingMeeting.committeeLevel;
      memberAttendingMeeting.userProfile = req.body.memberAttendingMeeting.userProfile;
      memberAttendingMeeting.memberAttended = req.body.memberAttendingMeeting.memberAttended;
      memberAttendingMeeting.meeting = req.body.memberAttendingMeeting.meeting;


      memberAttendingMeeting.save(function (err) {
        if (err) res.status(500).json(err);
        else {
          res.json({ memberAttendingMeeting: memberAttendingMeeting });
        }
      });
    }
  });
});

module.exports = router;