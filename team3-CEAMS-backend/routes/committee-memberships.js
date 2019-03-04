var express = require('express');
var router = express.Router();

var CommitteeMemberships = require('../models/committeeMemberships');
var Committees = require('../models/committees');
var Instructors = require('../models/instructors');
var Staff = require('../models/staffs');
var TeachingAssistants = require('../models/teachingAssistants');

/* GET all */
router.get('/', function (req, res) {
    CommitteeMemberships.Model.find((err, committeeMemberships) => {
        if (err) res.status(500).json(err);
        res.json({ committeeMembership: committeeMemberships });
    });
});

/* GET some */
router.get('/:id', function (req, res) {
    CommitteeMemberships.Model.findById(req.params.id, function (err, committeeMembership) {
        if (err) res.status(500).json(err);
        else res.json({ committeeMembership: committeeMembership });
    });
});

/* POST */
router.post('/', function (req, res) {
    var committeeMembership = new CommitteeMemberships.Model(req.body.committeeMembership);
    committeeMembership.save(function (err) {
        if (err) {
            res.status(500).json(err);
        }
        Committees.Model.findById(committeeMembership.committee, function (err, committee) {
            if (err) {
                res.status(500).json(err);
            }
            if (committee.members == null) {
                committee.members = [committeeMembership._id];
            } else {
                committee.members.push(committeeMembership._id)
            }
            committee.save(function (err) {
                if (err) {
                    res.status(500).json(err);
                }
                if (committeeMembership.instructorMember !== null) {
                    var model = Instructors;
                    var theID = committeeMemberShip.instructorMember;
                } else if (committeeMembership.staffMember !== null) {
                    var model = Staff;
                    var theID = committeeMembership.staffMember;
                } else if (committeeMembership.teachingAssistantMember !== null) {
                    var model = TeachingAssistants;
                    var theID = committeeMembership.teachingAssistantMember;
                } else {
                    res.status(500).json("No membership found");
                }
                console.log(theID);
                model.Model.findById(theID, function (err, user) {
                    if (err) {
                        res.status(500).json(err);
                    }
                    if (user.memberships == null) {
                        user.memberships = [committeeMembership._id];
                    } else {
                        user.memberships.push(committeeMembership._id);
                    }
                    user.save(function (err) {
                        if (err) {
                            res.status(500).json(err);
                        }
                        res.json({ committeeMembership: committeeMembership });
                    })
                })
            })
        })
    });
});

/* PUT */
router.put('/:id', function (req, res) {
    CommitteeMemberships.Model.findById(req.params.id, function (err, committeeMembership) {
        if (err) res.status(500).json(err);
        else {
            committeeMembership.participationStartDate = req.body.committeeMembership.participationStartDate;
            committeeMembership.participationEndDate = req.body.committeeMembership.participationEndDate;
            committeeMembership.role = req.body.committeeMembership.role;
            committeeMembership.meetings = req.body.committeeMembership.meetings;
            committeeMembership.committee = req.body.committeeMembership.committee;
            committeeMembership.instructorMember = req.body.committeeMembership.instructorMember;
            committeeMembership.staffMember = req.body.committeeMembership.staffMember;
            committeeMembership.teachingAssistantMember = req.body.committeeMembership.teachingAssistantMember;
            committeeMembership.save(function (err) {
                if (err) res.status(500).json(err);
                else {
                    res.json({ committeeMembership: committeeMembership });
                }
            });
        }
    });
});

/* DELETE */
router.delete('/:id', function (req, res) {
    CommitteeMemberships.Model.findById(req.params.id, function (err, committeeMembership) {
        CommitteeMemberships.Model.findOneAndDelete({ _id: req.params.id },
            function (err, deleted) {
                if (err) { res.status(500).json(err); }
                Committees.Model.findById(committeeMembership.committee, function (err, committee) {
                    if (err) {
                        res.status(500).json(err);
                    }
                    var index = committee.members.indexOf(req.params.id);
                    if (index > -1) {
                        committee.members.splice(index, 1);
                    }
                    committee.save(function (err) {
                        if (err) {
                            res.status(500).json(err);
                        }
                        if (committeeMembership.instructorMember !== null) {
                            var model = Instructors;
                            var theID = committeeMemberShip.instructorMember;
                        } else if (committeeMembership.staffMember !== null) {
                            var model = Staff;
                            var theID = committeeMembership.staffMember;
                        } else if (committeeMembership.teachingAssistantMember !== null) {
                            var model = TeachingAssistants;
                            var theID = committeeMembership.teachingAssistantMember;
                        } else {
                            res.status(500).json("No membership found");
                        }
                        model.Model.findById(theID, function (err, user) {
                            index = user.memberships.indexOf(req.params.id);
                            if (index > -1) {
                                user.memberships.splice(index, 1);
                            }
                            user.save(function (err) {
                                if (err) {
                                    res.status(500).json(err);
                                }
                                res.json({ committeeMembership: deleted });
                            })
                        })
                    })
                })
            }
        );
    })
});

module.exports = router;