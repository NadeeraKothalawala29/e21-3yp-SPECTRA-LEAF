import { Router } from 'express';
import { factoriesController } from './factories.controller';

const router = Router();

// Public — frontend uses a no-op login with no JWT
router.get('/:factoryId/batches', factoriesController.batches);
router.get('/:factoryId/readings', factoriesController.readings);

export default router;
