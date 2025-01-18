const responseHandler = (req, res, next) => {
    res.sendResponse = (statusCode, success, message, data = null, accessToken = null) => {
        if (accessToken) {
            res.setHeader('Authorization', `Bearer ${accessToken}`);
        }
        return res.status(statusCode).json({
            code: statusCode,
            success,
            message,
            data
        });
    };
    next();
};

module.exports = responseHandler;
