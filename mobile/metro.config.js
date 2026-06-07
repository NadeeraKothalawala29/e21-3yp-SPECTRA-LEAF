const { getDefaultConfig } = require('expo/metro-config');
const http = require('http');

const config = getDefaultConfig(__dirname);

const backendTarget = process.env.EXPO_DEV_API_PROXY_TARGET || 'http://localhost:5000';

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (!req.url || !req.url.startsWith('/api')) {
        return middleware(req, res, next);
      }

      const target = new URL(req.url, backendTarget);
      const proxyReq = http.request(
        target,
        {
          method: req.method,
          headers: {
            ...req.headers,
            host: target.host,
          },
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
          proxyRes.pipe(res);
        }
      );

      proxyReq.on('error', () => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'API proxy failed' }));
      });

      req.pipe(proxyReq);
    };
  },
};

module.exports = config;
