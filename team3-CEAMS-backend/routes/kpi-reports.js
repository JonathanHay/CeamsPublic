var express = require('express');
var router = express.Router();
var AuditTrails = require('../models/auditTrails');
var UserAccounts = require('../models/userAccounts');
var Semesters = require('../models/semesters');
var UserEvaluationMethods = require('../models/userEvaluationMethods');

function getScore(username, callback) {
    AuditTrails.Model.find({ authorUserName: username }, function (err, AuditTrails) {
        if (err) res.status(500).json(err);

        //The formula depends on up to four factors: number of times they've logged in, number of tests they've graded, number of courses they teach,
        //and total actions they have performed that are stored in the auditTrail.
        var numLogins = 0;
        var numGraded = 0;
        var numCourses = 0;
        var totalActions = 0;
        var KPIScore = 0;

        //Grabbing results for how many times they've logged in or graded a test (based on auditTrail data) as well as total actions
        AuditTrails.forEach(function (obj) {
            if (obj.actionDesc == "logIn") {
                numLogins++;
            } else if (obj.actionDesc == "testGraded") {
                numGraded++;
            }
            totalActions++;
        })

        //Grabs the UserAccount with the username sent to the database
        UserAccounts.Model.findOne({ username: username }, function (err, UserAccount) {
            if (err) res.status(500).json(err);

            //If they're an instructor it grabs the number of courses they have taught
            if (UserAccount.instructor !== null) {
                var instructorID = UserAccount.instructor._id;
                Semesters.Model.find({ instructor: instructorID }, function (err, Semesters) {
                    if (err) res.status(500).json(err);
                    Semesters.forEach(function (obj2) {
                        numCourses++;
                    })
                })
            }

            //console.log("Number of logins: " + numLogins);
            //console.log("Number of grades: " + numGraded);
            //console.log("Number of courses: " + numCourses);
            //console.log("Total actions in auditTrail: " + totalActions);

            //finds the UserEvaluationMethod with the timeToApply closest to today's date
            UserEvaluationMethods.Model.findOne({ "timeToApply": { $lt: new Date() } }).sort({ "timeToApply": 'desc' }).exec(function (err, userEvaluationMethod) {
                if (err) res.status(500).json(err);
                //console.log(userEvaluationMethod);

                var formula = JSON.parse(userEvaluationMethod.formulaExpression);

                //if the user requested is an instructor, the instructor values of the last indicator are used to get their score
                if (UserAccount.instructor !== null) {
                    var score = formula.instructor.numLogins * numLogins +
                        formula.instructor.numGraded * numGraded + formula.instructor.numCourses * numCourses + formula.instructor.totalActions * totalActions;
                    var rawData = { "numLogins": numLogins, "numGraded": numGraded, "numCourses": numCourses, "totalActions": totalActions };
                } else {
                    //if they are staff, the staff values are used
                    var score = formula.staff.numLogins * numLogins + formula.staff.totalActions * totalActions;
                    var rawData = { "numLogins": numLogins, "totalActions": totalActions };

                }

                var results = { [username]: { "rawData": rawData, "score": score } }

                //return score

                return callback(results);
            });
        });
    });
}

/* GET all */
router.get('/', function (req, res) {
    var results = [];
    UserAccounts.Model.find(function (err, userAccounts) {
        //console.log("usraccts: " + userAccounts);
        if (err) res.status(500).json(err);
        for (var i = 0; i < userAccounts.length; i++) {
            getScore(userAccounts[i].username, (result) => {
                results.push(result);
                if (results.length === userAccounts.length) res.json(results);
            })
        }
    })
});

/* GET some */
router.get('/:username', function (req, res) {

    getScore(req.params.username, (results) => {
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