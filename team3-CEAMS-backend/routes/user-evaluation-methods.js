var express = require('express');
var router = express.Router();

var UserEvaluationMethods = require('../models/userEvaluationMethods');
var AuditTrails = require('../models/auditTrails');


/* GET all */
router.get('/', function (req, res) {
    UserEvaluationMethods.Model.find((err, userEvaluationMethods) => {
        if (err) res.status(500).json(err);
        res.json({ userEvaluationMethod: userEvaluationMethods });
    });
});

/* GET some */
router.get('/:id', function (req, res) {
    UserEvaluationMethods.Model.findById(req.params.id, function (err, userEvaluationMethod) {
        if (err) res.status(500).json(err);
        else res.json({ userEvaluationMethod: userEvaluationMethod });
    });
});

/* POST */
router.post('/', function (req, res) {
    var userEvaluationMethod = new UserEvaluationMethods.Model(req.body.userEvaluationMethod);
    userEvaluationMethod.save(function (err) {
        if (err) res.status(500).json(err);

        var auditTrailAction = new AuditTrails.Model({
            "authorUserName": req.body.username, "actionDesc": "createUserEvaluationMethod",
            "changeFrom": null, "changeTo": JSON.stringify(userEvaluationMethod), "affectedTable": "UserEvaluationMethod", "notes": "Method ID: " + userEvaluationMethod._id
        });
        auditTrailAction.save(function (err) {
            if (err) res.status(500).json(err);
            res.json({ userEvaluationMethod: userEvaluationMethod });
        })
    });
});

/* PUT */
router.put('/:id', function (req, res) {
    UserEvaluationMethods.Model.findById(req.params.id, function (err, userEvaluationMethod) {
        if (err) res.status(500).json(err);
        else {
            var oldMethod = JSON.stringify(userEvaluationMethod);
            userEvaluationMethod.formulaExpression = req.body.userEvaluationMethod.formulaExpression;
            userEvaluationMethod.formulaDescription = req.body.userEvaluationMethod.formulaDescription;
            userEvaluationMethod.timeToApply = req.body.userEvaluationMethod.timeToApply;
            userEvaluationMethod.instructors = req.body.userEvaluationMethod.instructors;
            userEvaluationMethod.staff = req.body.userEvaluationMethod.staff;

            userEvaluationMethod.save(function (err) {
                if (err) res.status(500).json(err);
                else {
                    var auditTrailAction = new AuditTrails.Model({
                        "authorUserName": req.body.username, "actionDesc": "editUserEvaluationMethod",
                        "changeFrom": oldMethod, "changeTo": JSON.stringify(userEvaluationMethod), "affectedTable": "UserEvaluationMethod", "notes": "Method ID: " + userEvaluationMethod._id
                    });
                    auditTrailAction.save(function (err) {
                        if (err) res.status(500).json(err);
                        res.json({ userEvaluationMethod: userEvaluationMethod });
                    })
                }
            });
        }
    });
});

/* DELETE */
router.delete('/:id', function (req, res) {
    UserEvaluationMethods.Model.findOneAndDelete({ _id: req.params.id },
        function (err, deleted) {
            if (err) res.status(500).json(err);
            else {
                var auditTrailAction = new AuditTrails.Model({
                    "authorUserName": req.body.username, "actionDesc": "deleteUserEvaluationMethod",
                    "changeFrom": JSON.stringify(deleted), "changeTo": null, "affectedTable": "UserEvaluationMethod", "notes": "Method ID: " + deleted._id
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