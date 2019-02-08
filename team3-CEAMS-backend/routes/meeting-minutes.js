var express = require('express');
var router = express.Router();

var MeetingMinutes = require('../models/meeting-minutes');

/* GET all */
router.get('/', function(req, res) {
  MeetingMinutes.Model.find((err, meetingMinute) => {
    if (err) res.status(500).json(err);
    res.json({meetingMinute: meetingMinute});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  MeetingMinutes.Model.findById(req.params.id, function (err, meetingMinute) {
    if (err) res.status(500).json(err);
    else res.json({meetingMinute: meetingMinute});
  });
});

/* POST */
router.post('/', function(req, res) {
  var meetingMinute = new MeetingMinutes.Model(req.body.meetingMinute);
  meetingMinute.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({meetingMinute: meetingMinute});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  MeetingMinutes.Model.findById(req.params.id, function (err, meetingMinute) {
    if (err) res.status(500).json(err);
    else {
        meetingMinute.meetingTitle = req.body.meetingMinute.meetingTitle;
        meetingMinute.meetingPlace = req.body.meetingMinute.meetingPlace;
        meetingMinute.meetingObjective = req.body.meetingMinute.meetingObjective;
        meetingMinute.meetingDescription = req.body.meetingMinute.meetingDescription;
        meetingMinute.otherDetail = req.body.meetingMinute.otherDetail;
        meetingMinute.recommendation = req.body.meetingMinute.recommendation;
        meetingMinute.decision = req.body.meetingMinute.decision;
        meetingMinute.meetingTopic = req.body.meetingMinute.meetingTopic;
        meetingMinute.meeting = req.body.meetingMinute.meeting;
        meetingMinute.memberAttended = req.body.meetingMinute.memberAttended;

        meetingMinute.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({meetingMinute: meetingMinute});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function(req, res) {
  MeetingMinutes.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        res.json({meetingMinute: deleted});
      }
    }
);
});

module.exports = router;