var express = require('express');
var router = express.Router();
var Roles = require('../models/roles');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var role = new Roles.Model(request.body.role);
        role.save(function (error) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({role: role});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Roles.Model.find(function (error, codes) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({role: codes});
            }
        });
    });

router.route('/:role_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Roles.Model.findById(request.params.role_id, function (error, role) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({role: role});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Roles.Model.findById(request.params.role_id, function (error, role) {
            if (error) {
                response.send({error: error});
            }
            else {
                // update the role info
                role.name = request.body.role.name;
                role.userRoles = request.body.role.userRoles;
                role.functions = request.body.role.permissions;

                role.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({role: role});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Roles.Model.findByIdAndRemove(request.params.role_id,
            function (error, deleted) {
                if (!error) {
                    response.json({role: deleted});
                };
            }
        );
    });


module.exports = router;
