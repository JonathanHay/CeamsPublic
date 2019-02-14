var express = require('express');
var router = express.Router();

var MembersAttended = require('../models/members-attended');
var MeetingMinutes = require('../models/meeting-minutes');
var MemberAttendingMeeting = require('../models/members-attending-meeting');

/* GET all */
router.get('/', function (req, res) {
    MembersAttended.Model.find((err, memberAttended) => {
        if (err) res.status(500).json(err);
        res.json({ memberAttended: memberAttended });
    });
});

/* GET some */
router.get('/:id', function (req, res) {
    MembersAttended.Model.findById(req.params.id, function (err, memberAttended) {
        if (err) res.status(500).json(err);
        else res.json({ memberAttended: memberAttended });
    });
});

/* POST */
router.post('/', function (req, res) {
    var memberAttended = new MembersAttended.Model(req.body.memberAttended);
    memberAttended.save(function (err) {
        if (err) {
            res.status(500).json(err);
        } else {
            MeetingMinutes.Model.findById(memberAttended.meetingMinutes, function (err, meetingMinutes) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    if (meetingMinutes.memberAttended == null) {
                        meetingMinutes.memberAttended = [memberAttended._id];
                    } else {
                        meetingMinutes.memberAttended.push(memberAttended._id);
                    }
                    meetingMinutes.save(function (err) {
                        if (err) res.status(500).json(err);
                        MemberAttendingMeeting.Model.findById(memberAttended.memberAttendingMeeting, function (err, memberAttendingMeeting) {
                            if (err) {
                                res.status(500).json(err);
                            } else {
                                if (memberAttendingMeeting.memberAttended == null) {
                                    memberAttendingMeeting.memberAttended = [memberAttended._id];
                                } else {
                                    memberAttendingMeeting.memberAttended.push(memberAttended._id);
                                }
                                memberAttendingMeeting.save(function (err) {
                                    if (err) res.status(500).json(err);
                                    res.json({ memberAttended: memberAttended });
                                });

                            }
                        })
                    });
                }
            })
        }
    });
});

/* PUT */
router.put('/:id', function (req, res) {
    MembersAttended.Model.findById(req.params.id, function (err, memberAttended) {
        if (err) res.status(500).json(err);
        else {
            memberAttended.memberAttendingMeeting = req.body.memberAttended.memberAttendingMeeting;
            memberAttended.meetingMinutes = req.body.memberAttended.meetingMinutes;

            memberAttended.save(function (err) {
                if (err) res.status(500).json(err);
                else {
                    res.json({ memberAttended: memberAttended });
                }
            });
        }
    });
});

// im sorry
router.delete('/:id', function (req, res) {

    MembersAttended.Model.findById(req.params.id, function (err, memberAttended) {
        if (err) { res.status(500).json(err); }
        else {
            console.log(memberAttended);
            MembersAttended.Model.findOneAndDelete({ _id: req.params.id },
                function (err, deleted1) {
                    if (err) res.status(500).json(err);
                    else {
                        console.log(memberAttended);

                        MeetingMinutes.Model.findById(memberAttended.meetingMinutes, function (err, meetingMinutes) {
                            if (err) res.status(500).json(err);
                            else {
                                var index = meetingMinutes.memberAttended.indexOf(req.params.id);
                                if (index > -1) {
                                    meetingMinutes.memberAttended.splice(index, 1);
                                    meetingMinutes.save(function (err) {
                                        if (err) res.status(500).json(err);

                                        MemberAttendingMeeting.Model.findById(memberAttended.memberAttendingMeeting, function (err, memberAttendingMeeting) {
                                            if (err) res.status(500).json(err);
                                            else {
                                                var index1 = memberAttendingMeeting.memberAttended.indexOf(req.params.id);
                                                if (index1 > -1) {
                                                    memberAttendingMeeting.memberAttended.splice(index1, 1);
                                                    memberAttendingMeeting.save(function (err) {
                                                        if (err) res.status(500).json(err);
                                                        res.json({ deleted: deleted1 });
                                                    });
                                                }
                                            }
                                        });

                                    });
                                }
                            }
                        });
                    }
                }
            );
        }
    });
});

module.exports = router;