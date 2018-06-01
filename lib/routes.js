"use strict";
const express = require("express");
const router = express.Router();
const jwt = require("express-jwt");
const awsHelper = require("./awsHelper");
const config = require("./config");
const errors = require("./errors");
const presign = require("./presign");
const health = require("./health");

function getErrorHandler() {
    if (config.SERVER.isProduction) return errors.prodHandler();
    if (config.SERVER.env === "test") return errors.testHandler();
    return errors.devHandler();
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

router.use("/docs/v1", express.static("gen/apidoc/v1"));
router.use(health);
router.use(jwtCheck, presign);

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
    const graphql = require("./graphql")(opts);
    router.use(graphql);
    router.use(errors.notFoundHandler());
    router.use(getErrorHandler());
});

module.exports = router;
