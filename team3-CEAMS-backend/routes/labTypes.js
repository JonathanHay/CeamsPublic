var express = require('express');
var router = express.Router();
var LabTypes = require('../models/labTypes');

/* GET all */
router.get('/', function(req, res) {
    LabTypes.Model.find((err, labTypes) => {
      if (err) res.status(500).json(err);
      res.json({labType: labTypes});
    });
  });
  
  /* GET some */
  router.get('/:id', function(req, res) {
    LabTypes.Model.findById(req.params.id, function (err, labType) {
      if (err) res.status(500).json(err);
      else res.json({labType: labType});
    });
  });
  
  /* POST */
  router.post('/', function(req, res) {
    var labType = new LabTypes.Model(req.body.labType);
    labType.save(function (err) {
        if (err) res.status(500).json(err);
        res.json({labType: labType});
    });
  });
  
  /* PUT */
  router.put('/:id', function(req, res) {
    LabTypes.Model.findById(req.params.id, function (err, labType) {
      if (err) res.status(500).json(err);
      else {
          labType.code = req.body.labType.code;
          labType.name = req.body.labType.name;
          labType.save(function (err) {
              if (err) res.status(500).json(err);
              else {
                  res.json({labType: labType});
              }
          });
      }
    });
  });
  
  /* DELETE */
  router.delete('/:id', function(req, res) {
    LabTypes.Model.findOneAndDelete({_id: req.params.id},
      function (err, deleted) {
        if (err) res.status(500).json(err);
        else {
          res.json({labType: deleted});
        }
      }
  );
  });
  
  module.exports = router;