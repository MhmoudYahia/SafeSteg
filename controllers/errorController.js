const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // later isa
  }
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
};
