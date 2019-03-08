var express = require('express');
var router = express.Router();

var MeetingOutcomes = require('../models/meetingOutcomes');
var Meetings = require('../models/meetings')
var AuditTrails = require('../models/auditTrails');

/* GET all */
router.get('/', function (req, res) {
    MeetingOutcomes.Model.find((err, meetingOutcomes) => {
        if (err) res.status(500).json(err);
        res.json({ meetingOutcome: meetingOutcomes });
    });
});

/* GET some */
router.get('/:id', function (req, res) {
    MeetingOutcomes.Model.findById(req.params.id, function (err, meetingOutcome) {
        if (err) res.status(500).json(err);
        else res.json({ meetingOutcome: meetingOutcome });
    });
});

/* POST */
router.post('/', function (req, res) {
    var meetingOutcome = new MeetingOutcomes.Model(req.body.meetingOutcome);
    console.log(req.body.meetingOutcome);
    meetingOutcome.save(function (err) {
        if (err) res.status(500).json(err);
        Meetings.Model.findById(req.body.meetingOutcome.meeting, function (err, meeting) {
            if (err) res.status(500).json(err);
            if (meeting.outcomes == null) {
                meeting.outcomes = [meetingOutcome._id];
            } else {
                meeting.outcomes.push(meetingOutcome._id)
            }
            meeting.save(function (err) {
                if (err) res.status(500).json(err);

                var auditTrailAction = new AuditTrails.Model({
                    "authorUserName": req.body.username, "actionDesc": "createMeetingOutcome",
                    "changeFrom": null, "changeTo": JSON.stringify(meetingOutcome), "affectedTable": "MeetingOutcomes", "notes": "MeetingOutcome ID: " + meetingOutcome._id
                });
                auditTrailAction.save(function (err) {
                    if (err) res.status(500).json(err);
                    res.json({ meetingOutcome: meetingOutcome });
                })
            })
        })
    });
});

/* PUT */
router.put('/:id', function (req, res) {
    MeetingOutcomes.Model.findById(req.params.id, function (err, meetingOutcome) {
        if (err) res.status(500).json(err);
        var oldMeetingOutcome = JSON.stringify(meetingOutcome);
        meetingOutcome.title = req.body.meetingOutcome.title;
        meetingOutcome.description = req.body.meetingOutcome.description;
        meetingOutcome.recommendations = req.body.meetingOutcome.recommendations;
        meetingOutcome.decision = req.body.meetingOutcome.decision;
        meetingOutcome.meetings = req.body.meetingOutcome.meetings;
        meetingOutcome.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                var auditTrailAction = new AuditTrails.Model({
                    "authorUserName": req.body.username, "actionDesc": "editMeetingOutcome",
                    "changeFrom": oldMeetingOutcome, "changeTo": JSON.stringify(meetingOutcome), "affectedTable": "MeetingOutcomes", "notes": "MeetingOutcome ID: " + meetingOutcome._id
                });
                auditTrailAction.save(function (err) {
                    if (err) res.status(500).json(err);
                    res.json({ meetingOutcome: meetingOutcome });
                })
            }
        });
    });
});

/* DELETE */
router.delete('/:id', function (req, res) {
    MeetingOutcomes.Model.findOneAndDelete({ _id: req.params.id },
        function (err, deleted) {
            if (err) res.status(500).json(err);
            Meetings.Model.findById(deleted.meetings, function (err, meeting) {
                if (err) res.status(500).json(err);
                var index = meeting.outcomes.indexOf(req.params.id);
                if (index > -1) {
                    meeting.outcomes.splice(index, 1);
                }
                meeting.save(function (err) {
                    if (err) res.status(500).json(err);

                    var auditTrailAction = new AuditTrails.Model({
                        "authorUserName": req.body.username, "actionDesc": "deleteMeetingOutcome",
                        "changeFrom": JSON.stringify(deleted), "changeTo": null, "affectedTable": "MeetingOutcomes", "notes": "MeetingOutcome ID: " + deleted._id
                    });
                    auditTrailAction.save(function (err) {
                        if (err) res.status(500).json(err);
                        res.json({ deleted: deleted });
                    })
                })
            })
        }
    );
});

module.exports = router;