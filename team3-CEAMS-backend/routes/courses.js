var express = require('express');
var router = express.Router();
var Courses = require('../models/courses');

router.route('/')
    .post(function (request, response) {
        var course = new Courses.Model(request.body.course);
        course.save(function (error) {
            if (error) response.send(error);
            response.json({course: course});
        });


    })
    .get(function (request, response) {
        Courses.Model.find(function (error, courses) {
            if (error) response.send(error);
            response.json({course: courses});
        });
    });

router.route('/:course_id')
    .get(function (request, response) {
        Courses.Model.findById(request.params.course_id, function (error, course) {
            if (error) {
                response.send({error: error});
            } else {
                response.json({course: course});
            }
        });
    })
    .put(function (request, response) {
        Courses.Model.findById(request.params.course_id, function (error, course) {
            if (error) {
                response.send({error: error});
            } else {
                course.number = request.body.course.number;
                course.title = request.body.course.title;
                course.calendarWebLink = request.body.course.calendarWebLink;
                course.notes = request.body.course.notes;
                course.kFactor = request.body.course.kFactor;
                course.engineeringScienceAUPercent = request.body.course.engineeringScienceAUPercent;
                course.engineeringDesignAUPercent = request.body.course.engineeringDesignAUPercent;
                course.mathAUPercent = request.body.course.mathAUPercent;
                course.naturalScienceAUPercent = request.body.course.naturalScienceAUPercent;
                course.complementaryStudiesAUPercent = request.body.course.complementaryStudiesAUPercent;
                course.academicCredit = request.body.course.academicCredit;
                course.labTutorialHoursPerWeek = request.body.course.labTutorialHoursPerWeek;
                course.numberOfLectureSections = request.body.course.numberOfLectureSections;
                course.numberOfLabTutorialSections = request.body.course.numberOfLabTutorialSections;
                course.numberOfLabs = request.body.course.numberOfLabs;
                course.laboratorySafetyTaught = request.body.course.laboratorySafetyTaught;
                course.laboratorySafetyExamined = request.body.course.laboratorySafetyExamined;

                course.terms = request.body.course.terms;
                course.indicators = request.body.course.indicators;
                course.preRequisites = request.body.course.preRequisites;
                course.coRequisites = request.body.course.coRequisites;
                course.courseType = request.body.course.courseType;
                course.mathType = request.body.course.mathType;
                course.NSType = request.body.course.NSType;
                course.CSType = request.body.course.CSType;
                course.labType = request.body.course.labType;
                course.requiredTextbooks = request.body.course.requiredTextbooks;
                course.learningOutcomes = request.body.course.learningOutcomes;
                course.courseContents = request.body.course.courseContents;

                course.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    } else {
                        response.json({course: course});
                    }
                });
            }
        });
    })
    .delete(function (request, response) {
        Courses.Model.findByIdAndRemove(request.params.course_id,
            function (error, deleted) {
                if (!error) {
                    response.json({course: deleted});
                }
            }
        );
    });

module.exports = router;
