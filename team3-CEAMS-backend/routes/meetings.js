var express = require('express');

var MeetingOutcomes = require('../models/meetingOutcomes');
var AuditTrails = require('../models/auditTrails');
var Meetings = require('../models/meetings');


var router = express.Router();
/* GET all */
router.get('/', function (req, res) {
  Meetings.Model.find((err, meetings) => {
    if (err) res.status(500).json(err);
    res.json({ meeting: meetings });
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  Meetings.Model.findById(req.params.id).populate('outcomes').exec(function(err, meeting){
    if (err) res.status(500).json(err);
    else res.json({ meeting: meeting });
  });
  // Meetings.Model.findById(req.params.id, function (err, meeting) {
  //   if (err) res.status(500).json(err);
  //   else res.json({meeting: meeting});
  // });
});

/* POST */
router.post('/', function (req, res) {
  var meeting = new Meetings.Model(req.body.meeting);
  meeting.save(function (err) {
    if (err) res.status(500).json(err);

    var auditTrailAction = new AuditTrails.Model({
      "authorUserName": req.body.username, "actionDesc": "createMeeting",
      "changeFrom": null, "changeTo": JSON.stringify(meeting), "affectedTable": "Meeting", "notes": "Meeting ID: " + meeting._id
    });
    auditTrailAction.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({ meeting: meeting });
    })
  });
});

/* PUT */
router.put('/:id', function (req, res) {
  Meetings.Model.findById(req.params.id, function (err, meeting) {
    if (err) res.status(500).json(err);
    var oldMeeting = JSON.stringify(meeting);
    meeting.startDateTime = req.body.meeting.startDateTime;
    meeting.endDateTime = req.body.meeting.endDateTime;
    meeting.location = req.body.meeting.location;
    meeting.description = req.body.meeting.description;
    meeting.minutes = req.body.meeting.minutes;
    meeting.outcomes = req.body.meeting.outcomes;
    meeting.attendees = req.body.meeting.attendees;
    meeting.save(function (err) {
      if (err) res.status(500).json(err);

      var auditTrailAction = new AuditTrails.Model({
        "authorUserName": req.body.username, "actionDesc": "editMeeting",
        "changeFrom": oldMeeting, "changeTo": JSON.stringify(meeting), "affectedTable": "Meeting", "notes": "Meeting ID: " + meeting._id
      });
      auditTrailAction.save(function (err) {
        if (err) res.status(500).json(err);
        res.json({ meeting: meeting });
      })
    });
  });
});

/* DELETE */
router.delete('/:id', function (req, res) {
  Meetings.Model.findOneAndDelete({ _id: req.params.id },
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        MeetingOutcomes.Model.deleteMany({ meetings: { $eq: req.params.id } }, function (err) {
          if (err) res.status(500).json(err);

          var auditTrailAction = new AuditTrails.Model({
            "authorUserName": req.body.username, "actionDesc": "deleteMeeting",
            "changeFrom": JSON.stringify(deleted), "changeTo": null, "affectedTable": "Meeting", "notes": "Meeting ID: " + deleted._id
          });
          auditTrailAction.save(function (err) {
            if (err) res.status(500).json(err);
            res.json({ meeting: deleted });
          })
        })
      }
    }
  );
});

module.exports = router;