"use strict";
const errors = require("restify-errors");
const util = require("util");

module.exports.notFoundHandler = () => {
    return (req, res, next) => {
        next(new errors.NotFoundError("Not found"));
    };
};

module.exports.testHandler = () => {
    return (err, req, res) => {
        let error = {
            message: err.message,
            code: err.restCode,
            errors: err.errors,
            stack: err.stack
        };
        req.log.info(err);
        res.status(err.status || err.statusCode || 500).json(error);
    };
};

module.exports.devHandler = () => {
    return (err, req, res) => {
        let error = {
            message: err.message,
            code: err.restCode,
            errors: err.errors,
            stack: err.stack
        };

        req.log.info(err);
        console.log(util.inspect(err, {depth: 10})); // eslint-disable-line no-console

        res.status(err.status || err.statusCode || 500).json(error);
    };
};

module.exports.prodHandler = () => {
    return (err, req, res) => {
        let error = {
            message: err.message,
            code: err.restCode,
            errors: err.errors
        };
        req.log.info(err);

        res.status(err.status || err.statusCode || 500).json(error);
    };
};
