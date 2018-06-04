"use strict";
const express = require("express");
const router = express.Router();
const errors = require("restify-errors");
const async = require("async");
const awsHelper = require("./awsHelper");

/**
 * @api {get} /presign Get presigned url
 * @apiVersion 1.0.0
 * @apiName GetPresignedUrl
 * @apiDescription Gets a presigned url
 * @apiGroup URLs
 * @apiParam {String} url The url to presign
 * @apiParam {String} [operation] Can be "getObject" (default) or "putObject"
 * @apiHeader {String} Authorization Bearer schema and JWT token.
 * @apiHeader {String} x-api-key API key.
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          "Authorization": "Bearer [token]",
 *          "x-api-key": "[key]"
 *      }
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "url": "https://s3-eu-west-1.amazonaws.com/pixlcrypt-content/users/pixlcrypt%40gmail.com/src/28973449265_07e3aa5d2e_b.jpg",
 *          "presigned": "https://pixlcrypt-content.s3.eu-west-1.amazonaws.com/users/pixlcrypt%40gmail.com/src/28973449265_07e3aa5d2e_b.jpg?AWSAccessKeyId=AKIAIFO3H22JSUGLBM4A&Expires=1528259413&Signature=R7yXMvdH%2F1rvTGbdzswCRrZCxcw%3D"
 *      }
 */
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
    awsHelper.getPresignedUrl(o.bucket, o.key, req.query.operation).then(presigned => {
        res.send({
            url: url,
            presigned: presigned
        });
    }).catch(err => {
        console.log(err);
        return next(new errors.BadRequestError("Could not presign url. Does it exist?", err));
    });
});

/**
 * @api {post} /presign Get presigned urls
 * @apiVersion 1.0.0
 * @apiName GetPresignedUrls
 * @apiDescription Gets presigned urls
 * @apiGroup URLs
 * @apiParam {String} urls Comma-separated list with urls to presign
 * @apiParam {String} [operation] Can be "getObject" (default) or "putObject"
 * @apiHeader {String} Authorization Bearer schema and JWT token.
 * @apiHeader {String} x-api-key API key.
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          "Authorization": "Bearer [token]",
 *          "x-api-key": "[key]"
 *      }
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      [
 *          {
 *              "url": "https://s3-eu-west-1.amazonaws.com/pixlcrypt-content/users/pixlcrypt%40gmail.com/src/28973449265_07e3aa5d2e_b.jpg",
 *              "presigned": "https://pixlcrypt-content.s3.eu-west-1.amazonaws.com/users/pixlcrypt%40gmail.com/src/28973449265_07e3aa5d2e_b.jpg?AWSAccessKeyId=AKIAIFO3H22JSUGLBM4A&Expires=1528259413&Signature=R7yXMvdH%2F1rvTGbdzswCRrZCxcw%3D"
 *          }
 *      ]
 */
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
            awsHelper.getPresignedUrl(o.bucket, o.key, req.body.operation).then(presigned => {
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
        let r = [];
        results.forEach(el => {
            if (el != null) r.push(el);
        })
        res.send(r);
    });
});

module.exports = router;
