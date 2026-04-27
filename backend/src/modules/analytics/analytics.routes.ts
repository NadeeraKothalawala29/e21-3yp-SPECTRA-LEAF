import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { analyticsController } from './analytics.controller';

const router = Router();

router.get('/mine', authenticate, requireRole('MANAGER'), analyticsController.mine);
router.get('/most-selling', authenticate, analyticsController.mostSelling);
router.get(
  '/overview',
  authenticate,
  requireRole('GENERAL_MANAGER'),
  analyticsController.factoryOverview
);
router.get(
  '/:factoryId',
  authenticate,
  requireRole('MANAGER', 'GENERAL_MANAGER'),
  analyticsController.forFactory
);

export default router;
