export type Role = 'OFFICER';

export interface AuthState {
  role: Role | null;
  factoryId: string;
  displayName: string;
}

export interface SensorReading {
  timestamp: string;
  deviceId: string;
  factoryId: string;
  batchId: string;
  color: number | null;
  temperature: number | null;
  mq135: number | null;
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

export interface BatchSummary {
  batchId: string;
  factoryId: string;
  glp: number | null;
  price: number | null;
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

export interface OfficerProfile {
  displayName: string;
  email: string;
  phone: string;
  shift: string;
  factoryId: string;
  role: Role;
}
