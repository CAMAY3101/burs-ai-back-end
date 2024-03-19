const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode;
    err.status = err.status;

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};

module.exports = errorHandler;
