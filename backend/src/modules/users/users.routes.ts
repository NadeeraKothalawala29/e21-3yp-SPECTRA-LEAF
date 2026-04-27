import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { usersController } from './users.controller';

const router = Router();

router.get('/me', authenticate, usersController.me);
router.get('/', authenticate, requireRole('GENERAL_MANAGER'), usersController.list);

export default router;
