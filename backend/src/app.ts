import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import batchRoutes from './modules/batch/batch.routes';
import deviceRoutes from './modules/device/device.routes';
import readingsRoutes, { sensorRouter } from './modules/readings/readings.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import factoriesRoutes from './modules/factories/factories.routes';

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) =>
  res.json({ success: true, data: { status: 'ok', service: 'spectraleaf-backend' } })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/readings', readingsRoutes);
app.use('/api/sensor', sensorRouter);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/factories', factoriesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`[SpectraLeaf] Backend running on http://localhost:${env.PORT}`);
  console.log(`[SpectraLeaf] DynamoDB: ${env.DYNAMODB_ENDPOINT ?? 'AWS default'}`);
});

export default app;
