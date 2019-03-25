var express = require('express');
var router = express.Router();
var Permissions = require('../models/permissions');

router.route('/')
    .post(function (request, response) {
        var Permission = new Permissions.Model(request.body.permission);
        Permission.save(function (error) {
            if (error) response.send(error);
            response.json({permission: Permission});
        });
    })
    .get(function (request, response) {
        var Permission = request.query.filter;
        if (!Permission) {
            Permissions.Model.find(function (error, Permissions) {
                if (error) response.send(error);
                response.json({permission: Permissions});
            });
        } else {
            Permissions.Model.find({ "role": Permission.role}, function (error, permissions) {
                if (error) response.send(error);
                response.json({permission: permissions});
            });
        }
    });

router.route('/:permission_id')
    .get(function (request, response) {
        Permissions.Model.findById(request.params.permission_id, function (error, Permission) {
            if (error) response.send(error);
            response.json({permission: Permission});
        })
    })
    .put(function (request, response) {
        Permissions.Model.findById(request.params.permission_id, function (error, Permission) {
            if (error) {
                response.send({error: error});
            }
            else {
                Permission.feature = request.body.permission.feature;
                Permission.permission = request.body.permission.permission;
                Permission.role = request.body.permission.role;
                Permission.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({permission: Permission});
                    }
                });
            }
        })
    })
    .delete(function (request, response) {
        Permissions.Model.findByIdAndRemove(request.params.permission_id,
            function (error, deleted) {
                if (!error) {
                    response.json({permission: deleted});
                };
            }
        );
    });

module.exports = router;
