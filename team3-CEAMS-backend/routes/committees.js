var express = require('express');
var router = express.Router();

var Committees = require('../models/committees');
var AuditTrails = require('../models/auditTrails');
var TeachingAssistants = require('../models/teachingAssistants');

/* GET all */
router.get('/', function (req, res) {
    Committees.Model.find((err, committees) => {
        if (err) res.status(500).json(err);
        res.json({ committee: committees });
    });
});

/* GET some */
router.get('/:id', function (req, res) {
    Committees.Model.findById(req.params.id, async function (err, committee) {
        if (err) res.status(500).json(err);
        // else {
        //     await committee.populate('members').execPopulate();
            
        //     for (let i = 0; i < committee.members.length; i++) {
        //         if (committee.members[i].instructorMember !== null) {
        //             await committee.members[i].populate('instructorMember').execPopulate();
        //         } else if (committee.members[i].staffMember !== null) {
        //             await committee.members[i].populate('staffMember').execPopulate();
        //         } else if (committee.members[i].teachingAssistantMember !== null) {
        //             await committee.members[i].populate('teachingAssistantMember').execPopulate();
        //         }
        //     }

        //     res.json({ committee: committee })
        // };
    });
});

/* POST */
router.post('/', function (req, res) {
    var committee = new Committees.Model(req.body.committee);
    committee.save(function (err) {
        if (err) res.status(500).json(err);

        var auditTrailAction = new AuditTrails.Model({
            "authorUserName": req.body.username, "actionDesc": "createCommittee",
            "changeFrom": null, "changeTo": JSON.stringify(committee), "affectedTable": "Committee", "notes": "Committee ID: " + committee._id
        });
        auditTrailAction.save(function (err) {
            if (err) res.status(500).json(err);
            res.json({ committee: committee });
        })
    });
});

/* PUT */
router.put('/:id', function (req, res) {
    Committees.Model.findById(req.params.id, function (err, committee) {
        if (err) res.status(500).json(err);
        else {
            var oldCommittee = JSON.stringify(committee);
            committee.name = req.body.committee.name;
            committee.level = req.body.committee.level;
            committee.dateCreated = req.body.committee.dateCreated;
            committee.members = req.body.committee.members;
            committee.save(function (err) {
                if (err) res.status(500).json(err);
                var auditTrailAction = new AuditTrails.Model({
                    "authorUserName": req.body.username, "actionDesc": "editCommittee",
                    "changeFrom": oldCommittee, "changeTo": JSON.stringify(committee),
                    "affectedTable": "Committee", "notes": "Committee ID: " + committee._id
                });
                auditTrailAction.save(function (err) {
                    if (err) res.status(500).json(err);
                    res.json({ committee: committee });
                })
            });
        }
    });
});

/* DELETE */
router.delete('/:id', function (req, res) {
    Committees.Model.findOneAndDelete({ _id: req.params.id },
        function (err, deleted) {
            if (err) res.status(500).json(err);
            else {
                var auditTrailAction = new AuditTrails.Model({
                    "authorUserName": req.body.username, "actionDesc": "deleteCommittee",
                    "changeFrom": JSON.stringify(deleted), "changeTo": null, "affectedTable": "Committee", "notes": "Committee ID: " + deleted._id
                });
                auditTrailAction.save(function (err) {
                    if (err) res.status(500).json(err);
                    res.json({ deleted: deleted });
                })
            }
        }
    );
});

module.exports = router;