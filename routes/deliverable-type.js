var express = require('express');
var router = express.Router();
var DelieverableType = require('../models/deliverable-types');

/* GET all */
router.get('/', function(req, res) {
    DelieverableType.Model.find((err, utils) => {
      if (err) res.status(500).json(err);
      res.json(utils);
    });
  });
  
  /* GET some */
  router.get('/:id', function(req, res) {
    DelieverableType.Model.findById(req.params.id, function (err, deliverableTypes) {
      if (err) res.status(500).json(err);
      else res.json({deliverableTypes: deliverableTypes});
    });
  });
  
  /* POST */
  router.post('/', function(req, res) {
    var deliverableTypes = new DelieverableType.Model(req.body.deliverableTypes);
    deliverableTypes.save(function (err) {
        if (err) res.status(500).json(err);
        res.json({deliverableTypes: deliverableTypes});
    });
  });
  
  /* PUT */
  router.put('/:id', function(req, res) {
    DelieverableType.Model.findById(req.params.id, function (err, deliverableTypes) {
      if (err) res.status(500).json(err);
      else {
        deliverableTypes.code = req.body.deliverableTypes.code;
        deliverableTypes.name = req.body.deliverableTypes.name;
        deliverableTypes.save(function (err) {
              if (err) res.status(500).json(err);
              else {
                  res.json({deliverableTypes: deliverableTypes});
              }
          });
      }
    });
  });
  
  /* DELETE */
  router.delete('/:id', function(req, res) {
    DelieverableType.Model.findOneAndDelete({_id: req.params.id},
      function (err, deleted) {
        if (err) res.status(500).json(err);
        else {
          response.json({deliverableTypes: deleted});
        }
      }
  );
  });
  
  module.exports = router;