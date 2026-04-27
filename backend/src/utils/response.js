function ok(res, data, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function created(res, data, message = 'Created') {
  return ok(res, data, message, 201);
}

function notFound(res, message = 'Item not found') {
  return res.status(404).json({
    success: false,
    message,
    data: null,
  });
}

function badRequest(res, message = 'Bad request', errors = null) {
  return res.status(400).json({
    success: false,
    message,
    ...(errors && { errors }),
    data: null,
  });
}

function serverError(res, message = 'Internal server error', err = null) {
  if (err) console.error('[ERROR]', message, err);
  return res.status(500).json({
    success: false,
    message,
    data: null,
  });
}

module.exports = { ok, created, notFound, badRequest, serverError };
