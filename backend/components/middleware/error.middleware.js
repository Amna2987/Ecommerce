const { AppError } = require('../utils/errors');

module.exports = (err, req, res, next) => {
  if (!(err instanceof AppError)) {
    console.error('Unexpected error:', err);
    err = new AppError(err.message || 'Internal Server Error', 500, 'INTERNAL_ERROR');
  }

  res.status(err.status).json({
    success: false,
    error: {
      message: err.message,
      code: err.code,
      details: err.details || null
    }
  }); 
};