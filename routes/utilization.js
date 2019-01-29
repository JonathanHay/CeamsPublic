var express = require('express');
var router = express.Router();

var Utilization = require('../models/utilizations');

/* GET all */
router.get('/', function(req, res) {
  Utilization.Model.find((err, utils) => {
    if (err) res.status(500).json(err);
    res.json(utils);
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  Utilization.Model.findById(req.params.id, function (err, utilization) {
    if (err) res.status(500).json(err);
    else res.json({utilization: utilization});
  });
});

/* POST */
router.post('/', function(req, res) {
  var utilization = new Utilization.Model(req.body.utilization);
  utilization.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({utilization: utilization});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  Utilization.Model.findById(req.params.id, function (err, utilization) {
    if (err) res.status(500).json(err);
    else {
        utilization.code = req.body.utilization.code;
        utilization.name = req.body.utilization.name;
        utilization.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({utilization: utilization});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function(req, res) {
  Utilization.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        response.json({utilization: deleted});
      }
    }
);
});

module.exports = router;