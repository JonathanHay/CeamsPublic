var express = require('express');
var router = express.Router();

var MathTypes = require('../models/mathTypes');

/* GET all */
router.get('/', function(req, res) {
  MathTypes.Model.find((err, mathTypes) => {
    if (err) res.status(500).json(err);
    res.json({mathType: mathTypes});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  MathTypes.Model.findById(req.params.id, function (err, mathType) {
    if (err) res.status(500).json(err);
    else res.json({mathType: mathType});
  });
});
 
/* POST */
router.post('/', function(req, res) {
  var mathType = new MathTypes.Model(req.body.mathType);
  mathType.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({mathType: mathType});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  MathTypes.Model.findById(req.params.id, function (err, mathType) {
    if (err) res.status(500).json(err);
    else {
        mathType.code = req.body.mathType.code;
        mathType.name = req.body.mathType.name;
        mathType.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({mathType: mathType});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function(req, res) {
  MathTypes.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        res.json({mathType: deleted});
      }
    }
);
});

module.exports = router;