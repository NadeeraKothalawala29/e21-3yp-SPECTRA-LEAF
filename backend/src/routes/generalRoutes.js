const { Router } = require('express');
const { getFactorySummaries, getCombinedSummary } = require('../controllers/generalController');

const router = Router();

router.get('/factories', getFactorySummaries);
router.get('/summary', getCombinedSummary);

module.exports = router;
