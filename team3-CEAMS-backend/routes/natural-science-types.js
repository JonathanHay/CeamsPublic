var express = require('express');
var router = express.Router();

var NaturalScienceTypes = require('../models/naturalScienceTypes');

/* GET all */
router.get('/', function(req, res) {
  NaturalScienceTypes.Model.find((err, naturalScienceTypes) => {
    if (err) res.status(500).json(err);
    res.json({naturalScienceType: naturalScienceTypes});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  NaturalScienceTypes.Model.findById(req.params.id, function (err, naturalScienceType) {
    if (err) res.status(500).json(err);
    else res.json({naturalScienceType: naturalScienceType});
  });
});
 
/* POST */
router.post('/', function(req, res) {
  var naturalScienceType = new NaturalScienceTypes.Model(req.body.naturalScienceType);
  naturalScienceType.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({naturalScienceType: naturalScienceType});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  NaturalScienceTypes.Model.findById(req.params.id, function (err, naturalScienceType) {
    if (err) res.status(500).json(err);
    else {
        naturalScienceType.code = req.body.naturalScienceType.code;
        naturalScienceType.name = req.body.naturalScienceType.name;
        naturalScienceType.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({naturalScienceType: naturalScienceType});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function(req, res) {
  NaturalScienceTypes.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        response.json({naturalScienceType: deleted});
      }
    }
);
});

module.exports = router;