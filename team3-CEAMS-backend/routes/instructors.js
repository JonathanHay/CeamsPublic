var express = require('express');

var Instructors = require('../models/instructors');

var router = express.Router();
router.get('/:id', function (req, res) {
    Instructors.Model.findById(req.params.id, function (err, instructor) {
        if (err) res.status(500).json(err);
        else res.json({ instructor: instructor });
    });
});
module.exports = router;