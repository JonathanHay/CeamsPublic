var express = require('express');
var router = express.Router();
var AcademicTerms = require('../models/academic-terms');


/* GET all */
router.get('/', function(req, res) {
    AcademicTerms.Model.find((err, academicTerms) => {
      if (err) res.status(500).json(err);
      res.json({academicTerm: academicTerms});
    });
  });
  
  /* GET some */
  router.get('/:id', function(req, res) {
    AcademicTerms.Model.findById(req.params.id, function (err, academicTerm) {
      if (err) res.status(500).json(err);
      else res.json({academicTerm: academicTerm});
    });
  });
  
  /* POST */
  router.post('/', function(req, res) {
    var academicTerm = new AcademicTerms.Model(req.body.academicTerm);
    academicTerm.save(function (err) {
        if (err) res.status(500).json(err);
        res.json({academicTerm: academicTerm});
    });
  });
  
  /* PUT */
  router.put('/:id', function(req, res) {
    AcademicTerms.Model.findById(req.params.id, function (err, academicTerm) {
      if (err) res.status(500).json(err);
      else {
        academicTerm.code = req.body.academicTerm.code;
        academicTerm.name = req.body.academicTerm.name;
        academicTerm.save(function (err) {
              if (err) res.status(500).json(err);
              else {
                  res.json({academicTerm: academicTerm});
              }
          });
      }
    });
  });
  
  /* DELETE */
  router.delete('/:id', function(req, res) {
    AcademicTerms.Model.findOneAndDelete({_id: req.params.id},
      function (err, deleted) {
        if (err) res.status(500).json(err);
        else {
          res.json({academicTerm: deleted});
        }
      }
  );
  });
  
  module.exports = router;