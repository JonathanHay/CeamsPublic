var express = require('express');
var router = express.Router();
var UserRoles = require('../models/userGivenRoles');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var userRole = new UserRoles.Model(request.body.userGivenRole);
        userRole.save(function (error) {
            if (error) response.send(error);
            response.json({userGivenRole: userRole});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var User = request.query.filter;
        if (!User) {
            UserRoles.Model.find(function (error, userRoles) {
                if (error) response.send(error);
                response.json({userGivenRole: userRoles});
            });
        } else {
            if (!User.user) {
                UserRoles.Model.find({"role": User.role}, function (error, userRoles) {
                    if (error) response.send(error);
                    response.json({userGivenRole: userRoles});
                });
            } else {
                if (!User.role) {
                    UserRoles.Model.find({"user": User.user}, function (error, userRoles) {
                        if (error) response.send(error);
                        response.json({userGivenRole: userRoles});
                    });
                } else {
                    UserRoles.Model.findOne({"user": User.user, "role": User.role}, function (error, userRoles) {
                        if (error) response.send(error);
                        response.json({userGivenRole: userRoles});
                    });
                }
            }
        }

    });

router.route('/:userGivenRole_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        UserRoles.Model.findById(request.params.userRole_id, function (error, userRole) {
            if (error) response.send(error);
            response.json({userGivenRole: userRole});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        UserRoles.Model.findById(request.params.userGivenRole_id, function (error, userRole) {
            if (error) {
                response.send({error: error});
            }
            else {
                userRole.dateAssigned = request.body.userGivenRole.dateAssigned;
                userRole.user = request.body.userGivenRole.user;
                userRole.role = request.body.userGivenRole.role;
                userRole.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({userGivenRole: userRole});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        UserRoles.Model.findByIdAndRemove(request.params.userGivenRole_id,
            function (error, deleted) {
                if (!error) {
                    response.json({userGivenRole: deleted});
                };
            }
        );
    });

module.exports = router;
