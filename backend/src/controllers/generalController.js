const {
  getFactoryBatches,
  getHighestPriceBatch,
  getLowestPriceBatch,
  getAllPricedBatches,
} = require('../services/dynamoService');
const { ok, badRequest } = require('../utils/response');

function parseIds(query) {
  if (!query) return [];
  return query.split(',').map((s) => s.trim()).filter(Boolean);
}

// GET /api/general/factories?ids=FAC001,FAC002
async function getFactorySummaries(req, res) {
  const ids = parseIds(req.query.ids);
  if (ids.length === 0) {
    return badRequest(res, 'Provide factory IDs as ?ids=FAC001,FAC002');
  }

  const summaries = await Promise.all(
    ids.map(async (factoryId) => {
      try {
        const [batches, highestBatch] = await Promise.all([
          getFactoryBatches(factoryId),
          getHighestPriceBatch(factoryId),
        ]);
        const pricedBatches = batches.filter((b) => b.price != null);
        const totalRevenue = pricedBatches.reduce((sum, b) => sum + (b.price ?? 0), 0);
        return {
          factoryId,
          totalBatches: batches.length,
          pricedBatches: pricedBatches.length,
          totalRevenue,
          topBatch: highestBatch
            ? { batchId: highestBatch.BATCH_ID, price: highestBatch.PRICE }
            : null,
        };
      } catch (err) {
        console.error(`[GM] Failed to build summary for ${factoryId}`, err);
        return {
          factoryId,
          totalBatches: 0,
          pricedBatches: 0,
          totalRevenue: 0,
          topBatch: null,
        };
      }
    })
  );
  return ok(res, summaries);
}

// GET /api/general/summary?ids=FAC001,FAC002
async function getCombinedSummary(req, res) {
  const ids = parseIds(req.query.ids);
  if (ids.length === 0) {
    return badRequest(res, 'Provide factory IDs as ?ids=FAC001,FAC002');
  }
  const perFactory = await Promise.all(
    ids.map(async (factoryId) => {
      try {
        const priced = await getAllPricedBatches(factoryId);
        return { factoryId, priced };
      } catch (err) {
        console.error(`[GM] Failed to load priced batches for ${factoryId}`, err);
        return { factoryId, priced: [] };
      }
    })
  );

  let totalRevenue = 0;
  let topBatch = null;
  let topFactory = null;
  let topFactoryRevenue = -Infinity;
  const factoryContributions = {};

  for (const { factoryId, priced } of perFactory) {
    const rev = priced.reduce((s, b) => s + (Number(b.PRICE) || 0), 0);
    totalRevenue += rev;
    factoryContributions[factoryId] = rev;
    if (rev > topFactoryRevenue) {
      topFactoryRevenue = rev;
      topFactory = factoryId;
    }
    for (const b of priced) {
      if (!topBatch || Number(b.PRICE) > Number(topBatch.price)) {
        topBatch = { batchId: b.BATCH_ID, factoryId: b.FACTORY_ID, price: b.PRICE };
      }
    }
  }

  if (topFactoryRevenue <= 0) {
    topFactory = null;
  }

  const factoryContributionPercentages = {};
  for (const [fid, rev] of Object.entries(factoryContributions)) {
    factoryContributionPercentages[fid] =
      totalRevenue > 0 ? +((rev / totalRevenue) * 100).toFixed(2) : 0;
  }

  return ok(res, {
    totalFactories: ids.length,
    totalRevenue,
    topFactory,
    topBatch,
    factoryContributionPercentages,
  });
}

module.exports = { getFactorySummaries, getCombinedSummary };
