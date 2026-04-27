const { Router } = require('express');
const { ingestReading } = require('../controllers/sensorController');

const router = Router();

router.post('/', ingestReading);

module.exports = router;
