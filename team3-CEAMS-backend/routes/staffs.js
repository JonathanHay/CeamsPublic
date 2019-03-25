var express = require('express');
var router = express.Router();
var Staffs = require('../models/staffs');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var staff = new Staffs.Model(request.body.staff);
        Staffs.save(function (error) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({staff: staff});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Staffs.Model.find(function (error, staffs) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({staff: staffs});
            }
        });
    });

router.route('/:staff_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Staffs.Model.findById(request.params.staff_id, function (error, staff) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({staff: staff});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Staffs.Model.findById(request.params.staff_id, function (error, staff) {
            if (error) {
                response.send({error: error});
            }
            else {
                // update the staff info
                staff.firstName = request.body.staff.firstName;
                staff.lastName = request.body.staff.lastName;
                staff.email = request.body.staff.email;
                staff.building = request.body.staff.building;
                staff.officeNumber = request.body.staff.officeNumber;
                staff.roleName = request.body.staff.roleName;
                staff.keyPerformanceIndicator = request.body.staff.keyPerformanceIndicator;
                staff.gender = request.body.staff.gender;
                staff.evaluationMethod = request.body.staff.evaluationMethod;
                staff.userShadow = request.body.staff.userShadow;
                staff.memberships = request.body.staff.memberships;

                staff.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({staff: staff});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Staffs.Model.findByIdAndRemove(request.params.staff_id,
            function (error, deleted) {
                if (!error) {
                    response.json({staff: deleted});
                };
            }
        );
    });


module.exports = router;
