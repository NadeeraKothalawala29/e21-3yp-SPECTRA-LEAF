export type Role = 'OFFICER' | 'MANAGER' | 'GENERAL_MANAGER';

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthState {
  role: Role;
  factoryId: string;
  factoryIds: string[];
  displayName: string;
}

// ─── Sensor / Batch data from new backend ────────────────────────────────────

export interface SensorReading {
  timestamp: string;
  deviceId: string;
  factoryId: string;
  batchId: string;
  color: number | null;
  temperature: number | null;
  mq135: number | null;
}

export interface GraphPoint {
  timestamp: string;
  value: number;
}

export interface BatchGraphs {
  batchId: string;
  temperature: GraphPoint[];
  color: GraphPoint[];
  mq135: GraphPoint[];
}

export interface BatchSummary {
  batchId: string;
  factoryId: string;
  glp: number | null;
  price: number | null;
}

export interface BatchListItem {
  batchId: string;
  lastTimestamp: string;
  latestTemperature: number | null;
  latestColor: number | null;
  latestMq135: number | null;
  glp: number | null;
  price: number | null;
}

export interface PricedBatch {
  batchId: string;
  factoryId: string;
  price: number;
  glp: number | null;
}

export interface FactoryDashboard {
  factoryId: string;
  totalBatches: number;
  latestReadings: SensorReading[];
  highestPriceBatch: { batchId: string; price: number; glp: number | null } | null;
  lowestPriceBatch: { batchId: string; price: number; glp: number | null } | null;
}

export interface FactorySummary {
  factoryId: string;
  totalBatches: number;
  pricedBatches: number;
  totalRevenue: number;
  topBatch: { batchId: string; price: number } | null;
}

export interface GeneralSummary {
  totalFactories: number;
  totalRevenue: number;
  topFactory: string | null;
  topBatch: { batchId: string; factoryId: string; price: number } | null;
  factoryContributionPercentages: Record<string, number>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
