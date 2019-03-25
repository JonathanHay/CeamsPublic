var express = require('express');
var router = express.Router();
var Instructors = require('../models/instructors');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var instructor = new Instructors.Model(request.body.instructor);
        instructor.save(function (error) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({instructor: instructor});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Instructors.Model.find(function (error, instructors) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({instructor: instructors});
            }
        });
    });

router.route('/:instructor_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Instructors.Model.findById(request.params.instructor_id, function (error, instructor) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({instructor: instructor});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Instructors.Model.findById(request.params.instructor_id, function (error, instructor) {
            if (error) {
                response.send({error: error});
            }
            else {
                // update the instructor info
                instructor.firstName = request.body.instructor.firstName;
                instructor.lastName = request.body.instructor.lastName;
                instructor.email = request.body.instructor.email;
                instructor.building = request.body.instructor.building;
                instructor.officeNumber = request.body.instructor.officeNumber;
                instructor.number = request.body.instructor.number;
                instructor.ccMemberStatus = request.body.instructor.ccMemberStatus;
                instructor.hireDate = request.body.instructor.hireDate;
                instructor.estimatedRetirementDate = request.body.instructor.estimatedRetirementDate;
                instructor.keyPerformanceIndicator = request.body.instructor.keyPerformanceIndicator;

                instructor.gender = request.body.instructor.gender;
                instructor.evaluationMethod = request.body.instructor.evaluationMethod;
                instructor.rank = request.body.instructor.rank;
                instructor.userShadow = request.body.instructor.userShadow;

                instructor.programs = request.body.instructor.programs;
                instructor.licenceProviders = request.body.instructor.licenceProviders;
                instructor.degreeProviders = request.body.instructor.degreeProviders;
                instructor.semesters = request.body.instructor.semesters;
                instructor.memberships = request.body.instructor.memberships;

                instructor.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({instructor: instructor});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Instructors.Model.findByIdAndRemove(request.params.instructor_id,
            function (error, deleted) {
                if (!error) {
                    response.json({instructor: deleted});
                };
            }
        );
    });


module.exports = router;
