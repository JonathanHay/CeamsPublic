var express = require('express');
var router = express.Router();

var MemberAttendingMeeting = require('../models/members-attending-meeting');

/* GET all */
router.get('/', function(req, res) {
  MemberAttendingMeeting.Model.find((err, membersAttendingMeeting) => {
    if (err) res.status(500).json(err);
    res.json({memberAttendingMeeting: membersAttendingMeeting});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  MemberAttendingMeeting.Model.findById(req.params.id, function (err, memberAttendingMeeting) {
    if (err) res.status(500).json(err);
    else res.json({memberAttendingMeeting: memberAttendingMeeting});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
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
        if(req.body.memberAttendingMeeting.hasOwnProperty('meeting')){
            memberAttendingMeeting.meeting.push(req.body.memberAttendingMeeting.meeting);
        }

        memberAttendingMeeting.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({memberAttendingMeeting: memberAttendingMeeting});
            }
        });
    }
  });
});

module.exports = router;