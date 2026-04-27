import { Request, Response, NextFunction } from 'express';
import { deviceService } from './device.service';

export const deviceController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const devices =
        req.user.role === 'GENERAL_MANAGER'
          ? await deviceService.listAll()
          : await deviceService.listForFactory(req.user.factoryId);
      res.json({ success: true, data: devices });
    } catch (e) {
      next(e);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await deviceService.getOrThrow(req.params.id);
      res.json({ success: true, data: device });
    } catch (e) {
      next(e);
    }
  },
};
