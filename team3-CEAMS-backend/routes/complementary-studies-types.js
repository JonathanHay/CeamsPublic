var express = require('express');
var router = express.Router();

var ComplementaryStudiesTypes = require('../models/complementaryStudiesTypes');

/* GET all */
router.get('/', function(req, res) {
  ComplementaryStudiesTypes.Model.find((err, complementaryStudiesTypes) => {
    if (err) res.status(500).json(err);
    res.json({complementaryStudiesType: complementaryStudiesTypes});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  ComplementaryStudiesTypes.Model.findById(req.params.id, function (err, complementaryStudiesType) {
    if (err) res.status(500).json(err);
    else res.json({complementaryStudiesType: complementaryStudiesType});
  });
});
 
/* POST */
router.post('/', function(req, res) {
  var complementaryStudiesType = new ComplementaryStudiesTypes.Model(req.body.complementaryStudiesType);
  complementaryStudiesType.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({complementaryStudiesType: complementaryStudiesType});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  ComplementaryStudiesTypes.Model.findById(req.params.id, function (err, complementaryStudiesType) {
    if (err) res.status(500).json(err);
    else {
        complementaryStudiesType.code = req.body.complementaryStudiesType.code;
        complementaryStudiesType.name = req.body.complementaryStudiesType.name;
        complementaryStudiesType.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({complementaryStudiesType: complementaryStudiesType});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function(req, res) {
  ComplementaryStudiesTypes.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        res.json({complementaryStudiesType: deleted});
      }
    }
);
});

module.exports = router;