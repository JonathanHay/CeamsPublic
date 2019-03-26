var express = require('express');
var router = express.Router();
var Capabilities = require('../models/capabilities');

router.route('/')
    .post(function (request, response) {
        var rolePermission = new Capabilities.Model(request.body.capability);
        rolePermission.save(function (error) {
            if (error) response.send(error);
            response.json({capability: rolePermission});
        });
    })
    .get(function (request, response) {
        var Permission = request.query.filter;
        if (!Permission) {
            Capabilities.Model.find(function (error, rolePermissions) {
                if (error) response.send(error);
                response.json({capability: rolePermissions});
            });
        } else {
            Capabilities.Model.find({"permissions": Permission.permissions}, function (error, permissions) {
                if (error) response.send(error);
                response.json({capability: permissions});
            });
        }
    });

router.route('/:capability_id')
    .get(function (request, response) {
        Capabilities.Model.findById(request.params.capability_id, function (error, rolePermission) {
            if (error) response.send(error);
            response.json({capability: rolePermission});
        })
    })
    .put(function (request, response) {
        Capabilities.Model.findById(request.params.capability_id, function (error, rolePermission) {
            if (error) {
                response.send({error: error});
            }
            else {
                rolePermission.systemFeature = request.body.capability.systemFeature;
                rolePermission.permissions = request.body.capability.permissions;
                rolePermission.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({capability: rolePermission});
                    }
                });
            }
        })
    })
    .delete(function (request, response) {
        Capabilities.Model.findByIdAndRemove(request.params.capability_id,
            function (error, deleted) {
                if (!error) {
                    response.json({capability: deleted});
                };
            }
        );
    });

module.exports = router;
