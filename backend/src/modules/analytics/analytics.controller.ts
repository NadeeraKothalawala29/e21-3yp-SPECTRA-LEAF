import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service';

export const analyticsController = {
  async forFactory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.forFactory(req.params.factoryId);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async mine(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const data = await analyticsService.forFactory(req.user.factoryId);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async mostSelling(req: Request, res: Response, next: NextFunction) {
    try {
      const factoryId = req.user?.role === 'GENERAL_MANAGER' ? undefined : req.user?.factoryId;
      const data = await analyticsService.mostSellingBatch(factoryId);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async factoryOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.factoryOverview();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },
};
