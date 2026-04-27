import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from './auth.service';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = loginSchema.parse(req.body);
      const result = await authService.login(body.username, body.password);
      res.json({ success: true, data: result });
    } catch (e) {
      next(e);
    }
  },

  async logout(_req: Request, res: Response) {
    res.json({ success: true, data: { message: 'Logged out' } });
  },
};
