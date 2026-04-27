import { readingsRepository } from './readings.repository';
import { deviceRepository } from '../device/device.repository';
import { AppError } from '../../middleware/error.middleware';
import { Reading } from '../../types';

export const readingsService = {
  async ingest(input: {
    deviceId: string;
    timestamp?: string;
    batchId?: string;
    temperature: number;
    mq137: number;
    colorR: number;
    colorG: number;
    colorB: number;
  }) {
    const appDeviceId = input.deviceId.includes('-')
      ? input.deviceId
      : input.deviceId.replace(/^([A-Z]+)(\d+)$/, '$1-$2');
    const device = await deviceRepository.getById(appDeviceId);
    if (!device) throw new AppError(404, `Device ${input.deviceId} not found`);

    const reading: Reading = {
      deviceId: appDeviceId,
      timestamp: input.timestamp ?? new Date().toISOString(),
      temperature: input.temperature,
      mq137: input.mq137,
      colorR: input.colorR,
      colorG: input.colorG,
      colorB: input.colorB,
      batchId: input.batchId ?? device.activeBatchId,
    };
    return readingsRepository.create(reading);
  },

  async forDevice(deviceId: string, batchId?: string) {
    if (batchId) return readingsRepository.listByBatch(deviceId, batchId);
    return readingsRepository.listByDevice(deviceId);
  },

  async latestForDevice(deviceId: string, limit = 20) {
    return readingsRepository.latestForDevice(deviceId, limit);
  },
};
