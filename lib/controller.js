"use strict";
const express = require("express");
const router = express.Router();
const errors = require("restify-errors");
const async = require("async");
const awsHelper = require("./awsHelper");

router.get("/presign", (req, res, next) => {
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

router.post("/presign", (req, res, next) => {
    const urls = req.body.urls;
    if (urls === undefined || typeof urls !== "string") {
        return next(new errors.BadRequestError("Missing urls parameter or urls parameter not a string!"));
    }

    async.mapLimit(urls.split(","), 10, (url, done) => {
        awsHelper.isS3Url(url);
        if (!awsHelper.isS3Url(url) || !awsHelper.isPresignPermitted(url, req.user.email)) {
            console.log("Url is not permitted to presign!", url);
            done();
        } else {
            const o = awsHelper.toS3Obj(url);
            awsHelper.getPresignedUrl(o.bucket, o.key).then(presigned => {
                done(null, {
                    url: url,
                    presigned: presigned
                });
            }).catch(err => {
                console.log("Got error during presign", err);
                done();
            });
        }
    }, (err, results) => {
        res.send(results);
    });
});

module.exports = router;
