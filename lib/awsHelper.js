"use strict";
const url = require("url");
const AWS = require("aws-sdk");
const config = require("./config");
AWS.config.region = config.aws.region;

const DEFAULT_EXPIRY = 60 * 60 * 60 * 2; //2 hours
const BUCKET_WHITELIST = ["pixlcrypt-content"];

module.exports.getS3Obj = function(bucket, key) {
    let s3 = new AWS.S3();
    let params = {Bucket: bucket, Key: key};
    return s3.getObject(params).promise().then(res => {
        return Promise.resolve(res.Body);
    });
};

module.exports.getToken = (username, password) => {
    return new Promise((resolve, reject) => {
        let provider = new AWS.CognitoIdentityServiceProvider();
        const params = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: config.auth.clientId,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password
            }
        };
        provider.initiateAuth(params).promise().then(res => {
            let token = res.AuthenticationResult.IdToken;
            resolve(token);
        }).catch(err => {
            reject(err);
        });
    });
};

module.exports.isPresignPermitted = (s, email) => {
    const bucket = getBucket(s);
    if (isBucketWhitelisted(bucket)) {
        const pathname = decodeURIComponent(url.parse(s).pathname);
        const paths = pathname.split("/");
        return paths[3] === email;
    }
    return false;
};

module.exports.isS3Url = s => {
    const hostname = url.parse(s).hostname;
    return hostname.startsWith("s3") && hostname.endsWith("amazonaws.com");
};

module.exports.toS3Obj = s => {
    const pathname = decodeURIComponent(url.parse(s).pathname);
    const paths = pathname.split("/");
    return {
        bucket: paths[1],
        key: paths.slice(2).join("/")
    };
};

module.exports.getPresignedUrl = (bucket, key) => {
    let s3 = new AWS.S3();

    return new Promise((resolve, reject) => {
        return s3.getSignedUrl("getObject", {
            Bucket: bucket,
            Key: key,
            Expires: DEFAULT_EXPIRY,
        }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

function getBucket(s) {
    const pathname = decodeURIComponent(url.parse(s).pathname);
    const paths = pathname.split("/");
    return paths[1];
}

function isBucketWhitelisted(bucket) {
    return BUCKET_WHITELIST.indexOf(bucket) != -1;
}
