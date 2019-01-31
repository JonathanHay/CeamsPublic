var express = require('express');
var router = express.Router();
var AcademicTerm = require('../models/academic-terms');


/* GET all */
router.get('/', function(req, res) {
    AcademicTerm.Model.find((err, utils) => {
      if (err) res.status(500).json(err);
      res.json(utils);
    });
  });
  
  /* GET some */
  router.get('/:id', function(req, res) {
    AcademicTerm.Model.findById(req.params.id, function (err, academicTerms) {
      if (err) res.status(500).json(err);
      else res.json({academicTerms: academicTerms});
    });
  });
  
  /* POST */
  router.post('/', function(req, res) {
    var academicTerms = new AcademicTerm.Model(req.body.academicTerms);
    academicTerms.save(function (err) {
        if (err) res.status(500).json(err);
        res.json({academicTerms: academicTerms});
    });
  });
  
  /* PUT */
  router.put('/:id', function(req, res) {
    AcademicTerm.Model.findById(req.params.id, function (err, academicTerms) {
      if (err) res.status(500).json(err);
      else {
        academicTerms.code = req.body.academicTerms.code;
        academicTerms.name = req.body.academicTerms.name;
        academicTerms.save(function (err) {
              if (err) res.status(500).json(err);
              else {
                  res.json({academicTerms: academicTerms});
              }
          });
      }
    });
  });
  
  /* DELETE */
  router.delete('/:id', function(req, res) {
    AcademicTerm.Model.findOneAndDelete({_id: req.params.id},
      function (err, deleted) {
        if (err) res.status(500).json(err);
        else {
          response.json({academicTerms: deleted});
        }
      }
  );
  });
  
  module.exports = router;