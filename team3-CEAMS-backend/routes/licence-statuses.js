//licence-statuses.js
var express = require('express');
var router = express.Router();

var LicenceStatus = require('../models/licence-statuses');

/* GET all */
router.get('/', function(req, res) {
    LicenceStatus.Model.find((err, licenceStatuses) => {
        if (err) res.status(500).json(err);
        res.json({licenceStatus: licenceStatuses});
    });
});

/* GET some */
router.get('/:id', function(req, res) {
    LicenceStatus.Model.findById(req.params.id, function (err, licenceStatus) {
        if (err) res.status(500).json(err);
        else res.json({licenceStatus: licenceStatus});
    });
});

/* POST */
router.post('/', function(req, res) {
    var licenceStatus = new LicenceStatus.Model(req.body.licenceStatus);
    licenceStatus.save(function (err) {
        if (err) res.status(500).json(err);
        res.json({licenceStatus: licenceStatus});
    });
});

/* PUT */
router.put('/:id', function(req, res) {
    LicenceStatus.Model.findById(req.params.id, function (err, licenceStatus) {
        if (err) res.status(500).json(err);
        else {
            licenceStatus.code = req.body.licenceStatus.code;
            licenceStatus.name = req.body.licenceStatus.name;
            licenceStatus.instructors = req.body.licenceStatus.instructors;
            licenceStatus.save(function (err) {
                if (err) res.status(500).json(err);
                else {
                    res.json({licenceStatus: licenceStatus});
                }
            });
        }
    });
});

/* DELETE */
router.delete('/:id', function(req, res) {
    LicenceStatus.Model.findOneAndDelete({_id: req.params.id},
        function (err, deleted) {
            if (err) res.status(500).json(err);
            else {
                res.json({licenceStatus: deleted});
            }
        }
    );
});

module.exports = router;