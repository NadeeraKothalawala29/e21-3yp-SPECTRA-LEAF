import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { readingsController } from './readings.controller';
import { sensorIngest } from './sensor.controller';

const router = Router();

router.post('/', readingsController.ingest);
router.get('/:deviceId/latest', authenticate, readingsController.latest);
router.get('/:deviceId', authenticate, readingsController.listForDevice);

export default router;

// Sensor ingest route (mobile-compatible, no auth, lenient)
export const sensorRouter = Router();
sensorRouter.post('/', sensorIngest);
