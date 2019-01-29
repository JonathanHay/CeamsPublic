var express = require('express');
var router = express.Router();

var ContentLevels = require('../models/content-levels');

/* GET all */
router.get('/', function(req, res) {
  ContentLevels.Model.find((err, utils) => {
    if (err) res.status(500).json(err);
    res.json(utils);
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  ContentLevels.Model.findById(req.params.id, function (err, contentLevels) {
    if (err) res.status(500).json(err);
    else res.json({contentLevels: contentLevels});
  });
});

/* POST */
router.post('/', function(req, res) {
  var contentLevels = new ContentLevels.Model(req.body.contentLevels);
  contentLevels.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({contentLevels: contentLevels});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  ContentLevels.Model.findById(req.params.id, function (err, contentLevels) {
    if (err) res.status(500).json(err);
    else {
        contentLevels.code = req.body.contentLevels.code;
        contentLevels.name = req.body.contentLevels.name;
        contentLevels.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({contentLevels: contentLevels});
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
        response.json({contentLevels: deleted});
      }
    }
);
});

module.exports = router;