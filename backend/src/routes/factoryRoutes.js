const { Router } = require('express');
const {
  getReadings,
  getBatches,
  getHighestPrice,
  getLowestPrice,
  getDashboard,
} = require('../controllers/factoryController');

const router = Router();

router.get('/:factoryId/readings', getReadings);
router.get('/:factoryId/batches', getBatches);
router.get('/:factoryId/highest-price', getHighestPrice);
router.get('/:factoryId/lowest-price', getLowestPrice);
router.get('/:factoryId/dashboard', getDashboard);

module.exports = router;
