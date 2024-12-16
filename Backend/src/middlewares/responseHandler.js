const responseHandler = (req, res, next) => {
    res.sendResponse = (statusCode, success, message, data = null, tokens = null) => {
        return res.status(statusCode).json({
            code: statusCode,
            success,
            message,
            data,
            tokens
        });
    };
    next();
};

module.exports = responseHandler;
