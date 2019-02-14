var express = require('express');
var router = express.Router();

var Meetings = require('../models/meetings');

/* GET all */
router.get('/', function(req, res) {
  Meetings.Model.find((err, meetings) => {
    if (err) res.status(500).json(err);
    res.json({meeting: meetings});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  Meetings.Model.findById(req.params.id, function (err, meeting) {
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
        meeting.memberAttendingMeeting = req.body.meeting.memberAttendingMeeting;
        meeting.meetingMinutes = req.body.meeting.meetingMinutes;
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
        res.json({meeting: deleted});
      }
    }
);
});

module.exports = router;