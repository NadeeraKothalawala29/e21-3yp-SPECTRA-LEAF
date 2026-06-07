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
    rgRatio: number;
    mq137: number;
    tgs2620: number;
    tgs822: number;
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
      rgRatio: input.rgRatio,
      mq137: input.mq137,
      tgs2620: input.tgs2620,
      tgs822: input.tgs822,
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
