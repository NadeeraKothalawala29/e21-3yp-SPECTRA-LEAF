import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { batchController } from './batch.controller';

const router = Router();

// Public batch creation — frontend uses fake login with no JWT
router.post('/public', batchController.createPublic);

router.get('/', authenticate, batchController.list);
router.get('/active/device/:deviceId', authenticate, batchController.getActiveForDevice);
router.get('/:id', authenticate, batchController.get);

router.post('/', authenticate, requireRole('OFFICER'), batchController.create);
router.patch(
  '/:id/good-leaf',
  authenticate,
  requireRole('OFFICER'),
  batchController.setGoodLeaf
);

// Mobile-compatible alias: PUT /:id/glp — no auth, accepts { glp, factoryId }
router.put('/:id/glp', batchController.setGlpPublic);
router.post(
  '/:id/skip-ready',
  authenticate,
  requireRole('OFFICER'),
  batchController.skipReadyPhase
);
router.post(
  '/:id/start',
  authenticate,
  requireRole('OFFICER'),
  batchController.start
);
router.post(
  '/:id/stop',
  authenticate,
  requireRole('OFFICER'),
  batchController.stop
);

router.patch(
  '/:id/price',
  authenticate,
  requireRole('MANAGER'),
  batchController.setPrice
);

export default router;
