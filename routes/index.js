var express = require('express');
var router = express.Router();

/* GET example */
router.get('/example', function(req, res, next) {
  res.send("GET");
});

/* POST example */
router.post('/example', function(req, res, next) {
  res.send("POST");
});

/* PUT example */
router.put('/example', function(req, res, next) {
  res.send("PUT");
});

/* DELETE example */
router.delete('/example', function(req, res, next) {
  res.send("DELETE");
});

module.exports = router;