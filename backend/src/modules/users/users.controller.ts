import { Request, Response, NextFunction } from 'express';
import { usersRepository } from './users.repository';

export const usersController = {
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const user = await usersRepository.getById(req.user.userId);
      if (!user) return res.status(404).json({ success: false, error: 'Not found' });
      const { passwordHash, ...safe } = user;
      return res.json({ success: true, data: safe });
    } catch (e) {
      next(e);
    }
  },

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await usersRepository.list();
      const safe = users.map(({ passwordHash, ...u }) => u);
      res.json({ success: true, data: safe });
    } catch (e) {
      next(e);
    }
  },
};
