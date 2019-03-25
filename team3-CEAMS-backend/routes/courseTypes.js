var express = require('express');
var router = express.Router();
var CourseTypes = require('../models/courseTypes');

router.route('/')
    .post(function (request, response) {
        var courseType = new CourseTypes.Model(request.body.courseType);
        courseType.save(function (error) {
            if (error) response.send(error);
            response.json({courseType: courseType});
        });


    })
    .get(function (request, response) {
        CourseTypes.Model.find(function (error, types) {
            if (error) response.send(error);
            response.json({courseType: types});
        });
    });

router.route('/:courseType_id')
    .get(function (request, response) {
        CourseTypes.Model.findById(request.params.courseType_id, function (error, type) {
            if (error) {
                response.send({error: error});
            } else {
                response.json({courseType: type});
            }
        });
    })
    .put(function (request, response) {
        CourseTypes.Model.findById(request.params.courseType_id, function (error, courseType) {
            if (error) {
                response.send({error: error});
            } else {
                courseType.code = request.body.courseType.code;
                courseType.name = request.body.courseType.name;
                courseType.courses = request.body.courseType.courses;

                courseType.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    } else {
                        response.json({courseType: courseType});
                    }
                });
            }
        });
    })
    .delete(function (request, response) {
        CourseTypes.Model.findByIdAndRemove(request.params.courseType_id,
            function (error, deleted) {
                if (!error) {
                    response.json({courseType: deleted});
                }
            }
        );
    });

module.exports = router;
