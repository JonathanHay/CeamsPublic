var express = require('express');
var router = express.Router();
var AuditTrails = require('../models/auditTrails');
var UserEvaluationMethods = require('../models/userEvaluationMethods');
var Instructors = require('../models/instructors');
var UserAccounts = require('../models/userAccounts');
var Semesters = require('../models/semesters');
var Staff = require('../models/staffs');
var UserEvaluationMethods = require('../models/userEvaluationMethods');

function getScore(id, callback) {
    UserAccounts.Model.findById(id, function (err, UserAccount) {
        if (err) res.status(500).json(err);

        //gets all audittrail data for the user passed to the function
        AuditTrails.Model.find({ authorUserName: UserAccount.userName }, function (err, AuditTrails) {
            if (err) res.status(500).json(err);

            //The formula depends on up to four factors: number of times they've logged in, number of tests they've graded, number of courses they teach,
            //and total actions they have performed that are stored in the auditTrail.
            var numLogins = 0, numGraded = 0, numCourses = 0, totalActions = 0, KPIScore = 0;

            //Grabbing results for how many times they've logged in or graded a test (based on auditTrail data) as well as total actions they have in the audittrail
            AuditTrails.forEach(function (obj) {
                if (obj.actionDesc == "logIn") {
                    numLogins++;
                } else if (obj.actionDesc == "testGraded") {
                    numGraded++;
                }
                totalActions++;
            })

            var evaluationMethod;

            console.log(UserAccount.instructor);
            //If they're an instructor it grabs the number of courses they have taught and the evaluation method to use
            if (UserAccount.instructor !== null && UserAccount.instructor !== undefined) {
                var instructorID = UserAccount.instructor;
                Semesters.Model.find({ instructor: instructorID }, function (err, Semesters) {
                    if (err) res.status(500).json(err);
                    Semesters.forEach(function (obj2) {
                        numCourses++;
                    })
                    Instructors.Model.findById(instructorID, function (err, Instructor) {
                        if (err) res.status(500).json(err);

                        if (!Instructor) {
                            var rawData = { "numLogins": null, "numGraded": null, "numCourses": null, "totalActions": null };
                            var results = { "_id": UserAccount._id, "rawData": rawData, "score": null, "error": "UserAccount has invalid Instructor ID" };
                            return callback(results);
                        }

                        evaluationMethod = Instructor.evaluationMethod;

                        UserEvaluationMethods.Model.findById(evaluationMethod, function (err, EvaluationMethod) {
                            if (err) res.status(500).json(err);

                            if (!EvaluationMethod) {
                                var rawData = { "numLogins": null, "numGraded": null, "numCourses": null, "totalActions": null };
                                var results = { "_id": UserAccount._id, "rawData": rawData, "score": null, "error": "Instructor has invalid EvaluationMethod ID" };
                                return callback(results);
                            }

                            var formula = JSON.parse(EvaluationMethod.formulaExpression);

                            var score = formula.numLogins * numLogins +
                                formula.numGraded * numGraded + formula.numCourses * numCourses + formula.totalActions * totalActions;
                            var rawData = { "numLogins": numLogins, "numGraded": numGraded, "numCourses": numCourses, "totalActions": totalActions };

                            var results = { "_id": UserAccount._id, "rawData": rawData, "userName": UserAccount.userName, "score": score, "formula": formula }

                            console.log(results);
                            //return score
                            return callback(results);
                        });
                    })
                })
            } else if (UserAccount.staff !== null && UserAccount.staff !== undefined) {
                console.log("Bam");
                var staffID = UserAccount.staff;

                Staff.Model.findById(staffID, function (err, Staff) {
                    if (err) res.status(500).json(err);

                    if (!Staff) {
                        var rawData = { "numLogins": null, "totalActions": null };
                        var results = { "_id": UserAccount._id, "rawData": rawData, "score": null, "userName": UserAccount.userName, "error": "UserAccount has invalid Staff ID" };
                        return callback(results);
                    }

                    evaluationMethod = Staff.evaluationMethod;

                    UserEvaluationMethods.Model.findById(evaluationMethod, function (err, EvaluationMethod) {
                        if (err) res.status(500).json(err);

                        if (!EvaluationMethod) {
                            var rawData = { "numLogins": null, "totalActions": null };
                            var results = { "_id": UserAccount._id, "rawData": rawData, "score": null, "error": "Staff has invalid EvaluationMethod ID" };
                            return callback(results);
                        }
                        var formula = JSON.parse(EvaluationMethod.formulaExpression);

                        var score = formula.numLogins * numLogins + formula.totalActions * totalActions;
                        var rawData = { "numLogins": numLogins, "totalActions": totalActions };

                        var results = { "_id": UserAccount._id, "rawData": rawData, "userName": UserAccount.userName, "score": score, "formula": formula }

                        //return score
                        return callback(results);
                    });
                })
            } else {
                console.log("bop");
                var rawData = { "numLogins": null, "totalActions": null };
                var results = { "_id": UserAccount._id, "rawData": rawData, "score": null, "error": "UserAccount has no Instructor or Staff ID" };
                return callback(results);
            }
        });
    });
}

/* GET all */
router.get('/', function (req, res) {
    var results = [];
    var reports;
    UserAccounts.Model.find(function (err, userAccounts) {
        //console.log("usraccts: " + userAccounts);
        if (err) res.status(500).json(err);
        for (var i = 0; i < userAccounts.length; i++) {
            getScore(userAccounts[i]._id, (result) => {
                results.push(result);
                reports = { "kpiReport": results }
                if (results.length === userAccounts.length) res.json(reports);
            })
        }
    })
});

/* GET some */
router.get('/:id', function (req, res) {

    getScore(req.params.id, (results) => {
        res.json({ results });
    })

});

// /* POST */
// router.post('/', function (req, res) {
//     var KPIReport = new KPIReports.Model(req.body.KPIReport);
//     KPIReport.save(function (err) {
//         if (err) res.status(500).json(err);
//         res.json({ KPIReport: KPIReport });
//     });
// });

// /* PUT */
// router.put('/:id', function (req, res) {
//     KPIReports.Model.findById(req.params.id, function (err, KPIReport) {
//         if (err) res.status(500).json(err);
//         else {
//             KPIReport.code = req.body.KPIReport.code;
//             KPIReport.name = req.body.KPIReport.name;
//             KPIReport.save(function (err) {
//                 if (err) res.status(500).json(err);
//                 else {
//                     res.json({ KPIReport: KPIReport });
//                 }
//             });
//         }
//     });
// });

// /* DELETE */
// router.delete('/:id', function (req, res) {
//     KPIReports.Model.findOneAndDelete({ _id: req.params.id },
//         function (err, deleted) {
//             if (err) res.status(500).json(err);
//             else {
//                 res.json({ KPIReport: deleted });
//             }
//         }
//     );
// });

module.exports = router;