import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { deviceController } from './device.controller';

const router = Router();

router.get('/', authenticate, deviceController.list);
router.get('/:id', authenticate, deviceController.get);

export default router;
