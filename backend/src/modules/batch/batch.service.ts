import { randomUUID } from 'crypto';
import { batchRepository } from './batch.repository';
import { deviceRepository } from '../device/device.repository';
import { AppError } from '../../middleware/error.middleware';
import { Batch } from '../../types';

export const batchService = {
  async createBatch(input: { factoryId: string; deviceId: string }) {
    const device = await deviceRepository.getById(input.deviceId);
    if (!device) throw new AppError(404, 'Device not found');
    if (device.factoryId !== input.factoryId) {
      throw new AppError(403, 'Device does not belong to your factory');
    }
    if (device.activeBatchId) {
      const existing = await batchRepository.getById(device.activeBatchId);
      if (existing && existing.status !== 'COMPLETED') {
        throw new AppError(
          409,
          'Device already has an active batch. Complete it before starting a new one.'
        );
      }
    }

    const batch: Batch = {
      batchId: `BATCH-${randomUUID().slice(0, 8).toUpperCase()}`,
      factoryId: input.factoryId,
      deviceId: input.deviceId,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    };
    await batchRepository.create(batch);
    await deviceRepository.setActiveBatch(input.deviceId, batch.batchId);
    return batch;
  },

  async getById(batchId: string) {
    const batch = await batchRepository.getById(batchId);
    if (!batch) throw new AppError(404, 'Batch not found');
    return batch;
  },

  async listForFactory(factoryId: string) {
    return batchRepository.listByFactory(factoryId);
  },

  async listAll() {
    return batchRepository.listAll();
  },

  async getActiveBatchForDevice(deviceId: string) {
    const device = await deviceRepository.getById(deviceId);
    if (!device || !device.activeBatchId) return null;
    const batch = await batchRepository.getById(device.activeBatchId);
    if (!batch) return null;
    return batch;
  },

  async setGoodLeafPercentage(batchId: string, pct: number) {
    if (pct < 0 || pct > 100) {
      throw new AppError(400, 'goodLeafPercentage must be between 0 and 100');
    }
    const batch = await batchRepository.getById(batchId);
    if (!batch) throw new AppError(404, 'Batch not found');
    if (batch.status !== 'DRAFT') {
      throw new AppError(
        409,
        `Cannot set good leaf percentage when status is ${batch.status}`
      );
    }
    return batchRepository.updateGoodLeafPercentage(
      batchId,
      pct,
      new Date().toISOString(),
      'READY_PHASE'
    );
  },

  async skipReadyPhase(batchId: string) {
    const batch = await batchRepository.getById(batchId);
    if (!batch) throw new AppError(404, 'Batch not found');
    if (batch.status !== 'READY_PHASE') {
      throw new AppError(
        409,
        `Cannot skip ready phase when status is ${batch.status}`
      );
    }
    return batchRepository.updateStatus(batchId, 'READY_TO_START');
  },

  async startFermentation(batchId: string) {
    const batch = await this.getById(batchId);
    if (batch.status !== 'READY_TO_START') {
      throw new AppError(
        409,
        `Cannot start fermentation when status is ${batch.status}`
      );
    }
    return batchRepository.updateStatus(batchId, 'ONGOING', {
      startedAt: new Date().toISOString(),
    });
  },

  async stopFermentation(batchId: string) {
    const batch = await batchRepository.getById(batchId);
    if (!batch) throw new AppError(404, 'Batch not found');
    if (batch.status !== 'ONGOING') {
      throw new AppError(
        409,
        `Cannot stop fermentation when status is ${batch.status}`
      );
    }
    const completed = await batchRepository.updateStatus(batchId, 'COMPLETED', {
      completedAt: new Date().toISOString(),
    });
    await deviceRepository.setActiveBatch(batch.deviceId, null);
    return completed;
  },

  async setSellingPrice(batchId: string, price: number) {
    if (price <= 0) {
      throw new AppError(400, 'sellingPrice must be greater than 0');
    }
    const batch = await batchRepository.getById(batchId);
    if (!batch) throw new AppError(404, 'Batch not found');
    if (batch.status !== 'COMPLETED') {
      throw new AppError(
        409,
        'Selling price can only be set on COMPLETED batches'
      );
    }
    return batchRepository.updatePrice(batchId, price);
  },
};
