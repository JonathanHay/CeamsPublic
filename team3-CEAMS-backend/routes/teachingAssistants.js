var express = require('express');
var router = express.Router();
var TeachingAssistants = require('../models/teachingAssistants');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var teachingAssistant = new TeachingAssistants.Model(request.body.teachingAssistant);
        TeachingAssistants.save(function (error) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({teachingAssistant: teachingAssistant});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        TeachingAssistants.Model.find(function (error, teachingAssistants) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({teachingAssistant: teachingAssistants});
            }
        });
    });

router.route('/:teachingAssistant_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        TeachingAssistants.Model.findById(request.params.teachingAssistant_id, function (error, teachingAssistant) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({teachingAssistant: teachingAssistant});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        TeachingAssistants.Model.findById(request.params.teachingAssistant_id, function (error, teachingAssistant) {
            if (error) {
                response.send({error: error});
            }
            else {
                // update the teachingAssistant info
                teachingAssistant.firstName = request.body.teachingAssistant.firstName;
                teachingAssistant.lastName = request.body.teachingAssistant.lastName;
                teachingAssistant.email = request.body.teachingAssistant.email;
                teachingAssistant.building = request.body.teachingAssistant.building;
                teachingAssistant.officeNumber = request.body.teachingAssistant.officeNumber;
                teachingAssistant.contractInfo = request.body.teachingAssistant.contractInfo;
                teachingAssistant.gender = request.body.teachingAssistant.gender;
                teachingAssistant.userShadow = request.body.teachingAssistant.userShadow;
                teachingAssistant.memberships = request.body.teachingAssistant.memberships;

                teachingAssistant.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({teachingAssistant: teachingAssistant});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        TeachingAssistants.Model.findByIdAndRemove(request.params.teachingAssistant_id,
            function (error, deleted) {
                if (!error) {
                    response.json({teachingAssistant: deleted});
                };
            }
        );
    });


module.exports = router;
