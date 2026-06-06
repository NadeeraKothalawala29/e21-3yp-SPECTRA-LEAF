const serverless = require('serverless-http');
const app = require('./app'); // This imports your existing app.js file

// This translates AWS Lambda requests into Express requests
module.exports.handler = serverless(app);