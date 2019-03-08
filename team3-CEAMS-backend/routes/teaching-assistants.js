var express = require('express');

var TeachingAssistants = require('../models/teachingAssistants');

var router = express.Router();
router.get('/:id', function (req, res) {
    TeachingAssistants.Model.findById(req.params.id, function (err, teachingAssistant) {
        if (err) res.status(500).json(err);
        else res.json({ teachingAssistant: teachingAssistant });
    });
});
module.exports = router;