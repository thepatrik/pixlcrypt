"use strict";
const express = require("express");
const router = express.Router();
const jwt = require("express-jwt");
const awsHelper = require("./awsHelper");
const config = require("./config");
const errorHandlers = require("./errors");
const errors = require("restify-errors");
const { postgraphile } = require("postgraphile");

function getErrorHandler() {
    if (config.SERVER.isProduction) return errorHandlers.prodHandler();
    if (config.SERVER.env === "test") return errorHandlers.testHandler();
    return errorHandlers.devHandler();
}

function getPubKey(req, payload, done) {
    awsHelper.getS3Obj(bucket, key).then(publicKey => {
        done(null, publicKey);
    });
}

const jwtCheck = jwt({
    secret: getPubKey,
    getToken: function fromHeaderOrQuerystring(req) {
        let token = null;
        if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.query && req.query.token) {
            token = req.query.token;
        }
        return token;
    }
});

router.get("/health", (req, res) => {
    res.sendStatus(200);
});

router.get("/presign", jwtCheck, (req, res, next) => {
    const url = req.query.url;
    if (url === undefined || typeof url !== "string") {
        return next(new errors.BadRequestError("Missing url parameter or url parameter not a string!"));
    }
    if (!awsHelper.isS3Url(url)) {
        return next(new errors.BadRequestError("Url parameter is not an s3 url!"));
    }

    if (!awsHelper.isPresignPermitted(url, req.user.email)) {
        return next(new errors.BadRequestError("Url is not permitted to presign!"));
    }

    const o = awsHelper.toS3Obj(url);
    awsHelper.getPresignedUrl(o.bucket, o.key).then(url => {
        res.send({url: url});
    }).catch(err => {
        console.log(err);
        return next(new errors.BadRequestError("Could not presign url. Does it exist?", err));
    });
});

const bucket = config.aws.authKeys.public.bucket;
const key = config.aws.authKeys.public.key;

awsHelper.getS3Obj(bucket, key).then(publicKey => {
    const opts = {
        extendedErrors: ["hint", "detail", "errcode"],
        disableQueryLog: process.env.DISABLE_QUERY_LOG === "true",
        jwtSecret: publicKey.toString(),
        jwtPgTypeIdentifier: "pixlcrypt.jwt_token",
        jwtAudiences: [config.auth.clientId]
    };
    router.use(postgraphile(process.env.DATABASE_URL || "postgres://localhost/", process.env.DATABASE_SCHEMA, opts));
    router.use(errorHandlers.notFoundHandler());
    router.use(getErrorHandler());
});

module.exports = router;
