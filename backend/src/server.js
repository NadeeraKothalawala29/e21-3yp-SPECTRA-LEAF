require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SpectraLeaf] Backend running on http://localhost:${PORT}`);
  console.log(`[SpectraLeaf] Table: ${process.env.DYNAMODB_TABLE_NAME || 'FermentationData'}`);
  console.log(`[SpectraLeaf] Region: ${process.env.AWS_REGION || 'us-east-1'}`);
});
