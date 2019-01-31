var express = require('express');
var router = express.Router();

var ComplimentaryStudiesType = require('../models/complimentary-studies-types');

/* GET all */
router.get('/', function(req, res) {
  ComplimentaryStudiesType.Model.find((err, utils) => {
    if (err) res.status(500).json(err);
    res.json(utils);
  });
});

/* GET some */
router.get('/:id', function(req, res) {
  ComplimentaryStudiesType.Model.findById(req.params.id, function (err, complimentaryStudiesType) {
    if (err) res.status(500).json(err);
    else res.json({complimentaryStudiesType: complimentaryStudiesType});
  });
});
 
/* POST */
router.post('/', function(req, res) {
  var complimentaryStudiesType = new ComplimentaryStudiesType.Model(req.body.complimentaryStudiesType);
  complimentaryStudiesType.save(function (err) {
      if (err) res.status(500).json(err);
      res.json({complimentaryStudiesType: complimentaryStudiesType});
  });
});

/* PUT */
router.put('/:id', function(req, res) {
  ComplimentaryStudiesType.Model.findById(req.params.id, function (err, complimentaryStudiesType) {
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
  ComplimentaryStudiesType.Model.findOneAndDelete({_id: req.params.id},
    function (err, deleted) {
      if (err) res.status(500).json(err);
      else {
        response.json({complimentaryStudiesType: deleted});
      }
    }
);
});

module.exports = router;