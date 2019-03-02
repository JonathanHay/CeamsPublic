var express = require('express');
var router = express.Router();

var MeetingOutcomes = require('../models/meetingOutcomes');

/* GET all */
router.get('/', function(req, res) {
    MeetingOutcomes.Model.find((err, meetingOutcomes) => {
        if (err) res.status(500).json(err);
        res.json({meetingOutcome: meetingOutcomes});
    });
});

/* GET some */
router.get('/:id', function(req, res) {
    MeetingOutcomes.Model.findById(req.params.id, function (err, meetingOutcome) {
        if (err) res.status(500).json(err);
        else res.json({meetingOutcome: meetingOutcome});
    });
});

/* POST */
router.post('/', function(req, res) {
    var meetingOutcome = new MeetingOutcomes.Model(req.body.meetingOutcome);
    meetingOutcome.save(function (err) {
        if (err) res.status(500).json(err);
        res.json({meetingOutcome: meetingOutcome});
    });
});

/* PUT */
router.put('/:id', function(req, res) {
    MeetingOutcomes.Model.findById(req.params.id, function (err, meetingOutcome) {
        if (err) res.status(500).json(err);
        else {
            meetingOutcome = req.body.meetingOutcome;
            meetingOutcome.save(function (err) {
                if (err) res.status(500).json(err);
                else {
                    res.json({meetingOutcome: meetingOutcome});
                }
            });
        }
    });
});

/* DELETE */
router.delete('/:id', function(req, res) {
    MeetingOutcomes.Model.findOneAndDelete({_id: req.params.id},
        function (err, deleted) {
            if (err) res.status(500).json(err);
            else {
                res.json({licenceStatus: deleted});
            }
        }
    );
});

module.exports = router;