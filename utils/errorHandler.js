function errorHandler(err, req, res, next) {
  console.error(err.stack);

  res.status(500).json({
    status: 500,
    message: 'Erro interno do servidor',
    error: err.message
  });
}

module.exports = errorHandler;
