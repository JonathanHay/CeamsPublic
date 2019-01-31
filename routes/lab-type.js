var express = require('express');
var router = express.Router();
var LabType = require('../models/lab-type');

/* GET all */
router.get('/', function(req, res) {
    LabType.Model.find((err, utils) => {
      if (err) res.status(500).json(err);
      res.json(utils);
    });
  });
  
  /* GET some */
  router.get('/:id', function(req, res) {
    LabType.Model.findById(req.params.id, function (err, labTypes) {
      if (err) res.status(500).json(err);
      else res.json({labTypes: labTypes});
    });
  });
  
  /* POST */
  router.post('/', function(req, res) {
    var labTypes = new LabType.Model(req.body.labTypes);
    labTypes.save(function (err) {
        if (err) res.status(500).json(err);
        res.json({labTypes: labTypes});
    });
  });
  
  /* PUT */
  router.put('/:id', function(req, res) {
    LabType.Model.findById(req.params.id, function (err, labTypes) {
      if (err) res.status(500).json(err);
      else {
          labTypes.code = req.body.labTypes.code;
          labTypes.name = req.body.labTypes.name;
          labTypes.save(function (err) {
              if (err) res.status(500).json(err);
              else {
                  res.json({labTypes: labTypes});
              }
          });
      }
    });
  });
  
  /* DELETE */
  router.delete('/:id', function(req, res) {
    LabType.Model.findOneAndDelete({_id: req.params.id},
      function (err, deleted) {
        if (err) res.status(500).json(err);
        else {
          response.json({labTypes: deleted});
        }
      }
  );
  });
  
  module.exports = router;