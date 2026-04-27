import { Request, Response, NextFunction } from 'express';
import { Role } from '../types';
import { AppError } from './error.middleware';

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Insufficient privileges'));
    }
    next();
  };
}
