var express = require('express');
var router = express.Router();
var DelieverableTypes = require('../models/deliverable-types');

/* GET all */
router.get('/', function(req, res) {
    DelieverableTypes.Model.find((err, deliverableTypes) => {
      if (err) res.status(500).json(err);
      res.json({deliverableType: deliverableTypes});
    });
  });
  
  /* GET some */
  router.get('/:id', function(req, res) {
    DelieverableTypes.Model.findById(req.params.id, function (err, deliverableType) {
      if (err) res.status(500).json(err);
      else res.json({deliverableType: deliverableType});
    });
  });
  
  /* POST */
  router.post('/', function(req, res) {
    var deliverableType = new DelieverableTypes.Model(req.body.deliverableType);
    deliverableType.save(function (err) {
        if (err) res.status(500).json(err);
        res.json({deliverableType: deliverableType});
    });
  });
  
  /* PUT */
  router.put('/:id', function(req, res) {
    DelieverableTypes.Model.findById(req.params.id, function (err, deliverableType) {
      if (err) res.status(500).json(err);
      else {
        deliverableType.code = req.body.deliverableType.code;
        deliverableType.name = req.body.deliverableType.name;
        deliverableType.save(function (err) {
              if (err) res.status(500).json(err);
              else {
                  res.json({deliverableType: deliverableType});
              }
          });
      }
    });
  });
  
  /* DELETE */
  router.delete('/:id', function(req, res) {
    DelieverableTypes.Model.findOneAndDelete({_id: req.params.id},
      function (err, deleted) {
        if (err) res.status(500).json(err);
        else {
          res.json({deliverableType: deleted});
        }
      }
  );
  });
  
  module.exports = router;