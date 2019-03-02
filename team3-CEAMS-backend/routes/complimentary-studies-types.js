var express = require('express');
var router = express.Router();

var ComplimentaryStudiesTypes = require('../models/complimentaryStudiesTypes');

/* GET all */
router.get('/', function(req, res) {
  ComplimentaryStudiesTypes.Model.find((err, complimentaryStudiesTypes) => {
    if (err) res.status(500).json(err);
    res.json({complimentaryStudiesType: complimentaryStudiesTypes});
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  ComplimentaryStudiesTypes.Model.findById(req.params.id, function (err, complimentaryStudiesType) {
    if (err) res.status(500).json(err);
    else res.json({complimentaryStudiesType: complimentaryStudiesType});
  });
});
 
/* POST */
router.post('/', function(req, res) {
  var complimentaryStudiesType = new ComplimentaryStudiesTypes.Model(req.body.complimentaryStudiesType);
  complimentaryStudiesType.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({complimentaryStudiesType: complimentaryStudiesType});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  ComplimentaryStudiesTypes.Model.findById(req.params.id, function (err, complimentaryStudiesType) {
    if (err) res.status(500).json(err);
    else {
        complimentaryStudiesType.code = req.body.complimentaryStudiesType.code;
        complimentaryStudiesType.name = req.body.complimentaryStudiesType.name;
        complimentaryStudiesType.save(function (err) {
            if (err) res.status(500).json(err);
            else {
                res.json({complimentaryStudiesType: complimentaryStudiesType});
            }
        });
    }
  });
});

/* DELETE */
router.delete('/:id', function(req, res) {
  ComplimentaryStudiesTypes.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        res.json({complimentaryStudiesType: deleted});
      }
    }
);
});

module.exports = router;