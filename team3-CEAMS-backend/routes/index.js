var express = require('express');
var router = express.Router();

router.use('/utilizations', require('./utilizations'));
router.use('/academic-terms', require('./academic-terms'));
router.use('/academic-years', require('./academic-years'));
router.use('/complimentary-studies-types', require('./complimentary-studies-types'));
router.use('/content-levels', require('./content-levels'));
router.use('/course-types', require('./course-types'));
router.use('/deliverable-types', require('./deliverable-types'));
router.use('/lab-types', require('./lab-types'));
router.use('/math-types', require('./math-types'));
router.use('/natural-science-types', require('./natural-science-types'));

module.exports = router;