import { deviceRepository } from './device.repository';
import { AppError } from '../../middleware/error.middleware';
import { Device } from '../../types';

function oneDevicePerFactory(devices: Device[]) {
  const byFactory = new Map<string, Device>();
  for (const device of [...devices].sort((a, b) => a.deviceId.localeCompare(b.deviceId))) {
    if (!byFactory.has(device.factoryId)) {
      byFactory.set(device.factoryId, device);
    }
  }
  return Array.from(byFactory.values());
}

export const deviceService = {
  async listForFactory(factoryId: string) {
    return oneDevicePerFactory(await deviceRepository.listByFactory(factoryId));
  },
  async listAll() {
    return oneDevicePerFactory(await deviceRepository.list());
  },
  async getOrThrow(deviceId: string) {
    const d = await deviceRepository.getById(deviceId);
    if (!d) throw new AppError(404, `Device ${deviceId} not found`);
    return d;
  },
};
