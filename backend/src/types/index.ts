export type Role = 'OFFICER' | 'MANAGER' | 'GENERAL_MANAGER';

export type BatchStatus =
  | 'DRAFT'
  | 'READY_PHASE'
  | 'READY_TO_START'
  | 'ONGOING'
  | 'COMPLETED';

export interface User {
  userId: string;
  username: string;
  passwordHash: string;
  role: Role;
  factoryId: string;
}

export interface JwtPayload {
  userId: string;
  role: Role;
  factoryId: string;
  username: string;
}

export interface Batch {
  batchId: string;
  factoryId: string;
  status: BatchStatus;
  deviceId: string;
  goodLeafPercentage?: number;
  sellingPrice?: number;
  createdAt: string;
  readyPhaseStartedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface Device {
  deviceId: string;
  factoryId: string;
  name: string;
  activeBatchId?: string;
}

export interface Reading {
  deviceId: string;
  timestamp: string;
  temperature: number;
  mq137: number;
  colorR: number;
  colorG: number;
  colorB: number;
  batchId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
