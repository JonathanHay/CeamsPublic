var express = require('express');
var router = express.Router();

router.use('/utilization', require('./utilization'));

module.exports = router;