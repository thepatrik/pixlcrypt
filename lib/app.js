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
const useCompression = process.env.USE_COMPRESSION !== "false";

// logger
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
        "x-api-secret"
    ]
});

requestLogger.unless = unless;

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

app.use(postgraphile(process.env.DATABASE_URL || "postgres://localhost/", process.env.DATABASE_SCHEMA));

app.set("json spaces", 2);

module.exports = app;
