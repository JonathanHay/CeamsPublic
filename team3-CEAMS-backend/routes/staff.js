var express = require('express');

var Staff = require('../models/staffs');

var router = express.Router();
router.get('/:id', function (req, res) {
    Staff.Model.findById(req.params.id, function (err, staff) {
        if (err) res.status(500).json(err);
        else res.json({ staff: staff });
    });
});
module.exports = router;