var express = require('express');
var router = express.Router();

router.use('/utilizations', require('./utilizations'));

module.exports = router;