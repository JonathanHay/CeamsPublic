var express = require('express');
var router = express.Router();

router.use('/academic-terms', require('./academic-terms'));
router.use('/academic-years', require('./academic-years'));
router.use('/committees', require('./committees'));
router.use('/committee-memberships', require('./committee-memberships'))
router.use('/complementary-studies-types', require('./complementary-studies-types'));
router.use('/content-levels', require('./content-levels'));
router.use('/course-types', require('./course-types'));
router.use('/deliverable-types', require('./deliverable-types'));
router.use('/kpi-reports', require('./kpi-reports'));
router.use('/meetings', require('./meetings'));
router.use('/meeting-outcomes', require('./meeting-outcomes'));
router.use('/instructors', require('./instructors'));
router.use('/lab-types', require('./lab-types'));
router.use('/math-types', require('./math-types'));
router.use('/natural-science-types', require('./natural-science-types'));
router.use('/staffs', require('./staffs'));
router.use('/teaching-assistants', require('./teaching-assistants'));
router.use('/utilizations', require('./utilizations'));
router.use('/user-evaluation-methods', require('./user-evaluation-methods'));

module.exports = router;