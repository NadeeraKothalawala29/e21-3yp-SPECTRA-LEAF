const { Router } = require('express');
const {
  getReadings,
  getGraphs,
  getSummary,
  updateGlp,
  updatePrice,
} = require('../controllers/batchController');

const router = Router();

router.get('/:batchId/readings', getReadings);
router.get('/:batchId/graphs', getGraphs);
router.get('/:batchId/summary', getSummary);
router.put('/:batchId/glp', updateGlp);
router.put('/:batchId/price', updatePrice);

module.exports = router;
