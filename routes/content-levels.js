var express = require('express');
var router = express.Router();

var ContentLevels = require('../models/content-levels');

/* GET all */
router.get('/', function(req, res) {
  ContentLevels.Model.find((err, contentLevels) => {
    if (err) res.status(500).json(err);
    res.json({contentLevel: contentLevels});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  ContentLevels.Model.findById(req.params.id, function (err, contentLevel) {
    if (err) res.status(500).json(err);
    else res.json({contentLevel: contentLevel});
  });
});

/* POST */
router.post('/', function(req, res) {
  var contentLevel = new ContentLevels.Model(req.body.contentLevel);
  contentLevel.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({contentLevel: contentLevel});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  ContentLevels.Model.findById(req.params.id, function (err, contentLevel) {
    if (err) res.status(500).json(err);
    else {
        contentLevel.code = req.body.contentLevel.code;
        contentLevel.name = req.body.contentLevel.name;
        contentLevel.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({contentLevel: contentLevel});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function(req, res) {
  ContentLevels.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        response.json({contentLevel: deleted});
      }
    }
);
});

module.exports = router;