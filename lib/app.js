"use strict";
require("dotenv").config({silent: true});
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const bunyanMiddleware = require("bunyan-middleware");
const bunyan = require("bunyan");
const unless = require("express-unless");
const { postgraphile } = require("postgraphile");
const requtil = require("./reqUtils");
const awsHelper = require("./awsHelper");
const config = require("./config");
const errors = require("./errors");
const useCompression = process.env.USE_COMPRESSION !== "false";

const logLvls = {
    "production": "info",
    "development": "info",
    "test": "warn"
};

const logger = bunyan.createLogger({
    name: "pixlcrypt",
    level: logLvls[process.env.NODE_ENV]
});

const requestLogger = bunyanMiddleware({
    logger: logger,
    filter: req => {
        return req.url === "/health";
    },
    obscureHeaders: [
        "Authorization",
        "x-api-key"
    ]
});

requestLogger.unless = unless;
app.use(requestLogger.unless({path: ["/health"]}));
app.use(requestLogger);

app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts({
    setIf: req => {
        return requtil.isSecure(req);
    }
}));

app.use(cors());
app.options("*", cors()); // include before other routes

if (useCompression) {
    app.use(compression());
}

const bucket = config.aws.authKeys.public.bucket;
const key = config.aws.authKeys.public.key;

awsHelper.getS3Obj(bucket, key).then(publicKey => {
    const opts = {
        extendedErrors: ["hint", "detail", "errcode"],
        disableQueryLog: process.env.DISABLE_QUERY_LOG === "true",
        jwtSecret: publicKey.toString(),
        jwtPgTypeIdentifier: "pixlcrypt.jwt_token",
        jwtAudiences: [config.auth.clientId]
        // jwtVerifyOptions: {audience: ""}
    };
    app.use(postgraphile(process.env.DATABASE_URL || "postgres://localhost/", process.env.DATABASE_SCHEMA, opts));
    app.use(errors.notFoundHandler());
    app.use(getErrorHandler());
});

app.set("json spaces", 2);

module.exports = app;

function getErrorHandler() {
    if (config.SERVER.isProduction) return errors.prodHandler();
    if (config.SERVER.env === "test") return errors.testHandler();
    return errors.devHandler();
}
