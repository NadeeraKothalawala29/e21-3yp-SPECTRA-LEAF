function requireFields(body, fields) {
  const missing = fields.filter(
    (f) => body[f] === undefined || body[f] === null || body[f] === ''
  );
  return missing;
}

function isValidNumber(value) {
  return value !== undefined && value !== null && !isNaN(Number(value));
}

function isValidTimestamp(value) {
  if (typeof value !== 'string') return false;
  return !isNaN(Date.parse(value));
}

module.exports = { requireFields, isValidNumber, isValidTimestamp };
