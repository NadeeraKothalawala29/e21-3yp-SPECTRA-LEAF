import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { usersRepository } from '../users/users.repository';
import { AppError } from '../../middleware/error.middleware';
import { JwtPayload } from '../../types';

export const authService = {
  async login(username: string, password: string) {
    const user = await usersRepository.getByUsername(username);
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, 'Invalid credentials');
    }
    const payload: JwtPayload = {
      userId: user.userId,
      username: user.username,
      role: user.role,
      factoryId: user.factoryId,
    };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
    return {
      token,
      user: {
        userId: user.userId,
        username: user.username,
        role: user.role,
        factoryId: user.factoryId,
      },
    };
  },
};
