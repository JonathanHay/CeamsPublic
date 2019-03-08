var express = require('express');
var CommitteeMemberships = require('../models/committeeMemberships');
var MeetingOutcomes = require('../models/meetingOutcomes');
var Meetings = require('../models/meetings');


var router = express.Router();
/* GET all */
router.get('/', function(req, res) {
  Meetings.Model.find().populate('outcomes').populate('attendees').exec(function(err, meetings){
    if (err) res.status(500).json(err);
    else res.json({meeting: meetings});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  Meetings.Model.findById(req.params.id).populate('outcomes').populate('attendees').exec(function(err, meeting){
    if (err) res.status(500).json(err);
    else res.json({meeting: meeting});
  });
});

/* POST */
router.post('/', function(req, res) {
  var meeting = new Meetings.Model(req.body.meeting);
  meeting.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({meeting: meeting});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  Meetings.Model.findById(req.params.id, function (err, meeting) {
    if (err) res.status(500).json(err);
    else {
        meeting.startDateTime = req.body.meeting.startDateTime;
        meeting.endDateTime = req.body.meeting.endDateTime;
        meeting.location = req.body.meeting.location;
        meeting.description = req.body.meeting.description;
        meeting.minutes = req.body.meeting.minutes;
        meeting.outcomes = req.body.meeting.outcomes;
        meeting.attendees = req.body.meeting.attendees;
        meeting.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({meeting: meeting});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function(req, res) {
  Meetings.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        MeetingOutcomes.Model.deleteMany({meetings: { $eq: req.params.id}}, function (err){
          if(err){
            res.status(500).json(err);
          }
        })
        res.json({meeting: deleted});
      }
    }
);
});

module.exports = router;