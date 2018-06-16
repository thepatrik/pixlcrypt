"use strict";
const FWD_HEADER = "x-forwarded-proto";
const HTTPS = "https";
const awsHelper = require("./awsHelper");

module.exports.isSecure = req => {
    return req.secure || req.header(FWD_HEADER) === HTTPS;
};

module.exports.swapToSignedUrls = (obj, email) => {
    const isString = typeof obj === "string";
    let o = isString ? JSON.parse(obj) : obj;
    traverse(o, email);
    return isString ? JSON.stringify(o) : o;
};

function traverse(o, email) {
    if (isArray(o)) {
        traverseArray(o, email);
    } else if (isObj(o)) {
        traverseObject(o, email);
    }
}

function traverseArray(arr, email) {
    arr.forEach(x => traverse(x, email));
}

function traverseObject(obj, email) {
    for (var key in obj) {
        if (typeof obj[key] === "string") {
            let url = obj[key];
            if (awsHelper.isS3Url(url) && awsHelper.isPresignPermitted(url, email)) {
                const o = awsHelper.toS3Obj(url);
                let presigned = awsHelper.getPresignedUrl(o.bucket, o.key);
                obj[key] = presigned;
            }
        }
        if (obj.hasOwnProperty(key)) {
            traverse(obj[key], email);
        }
    }
}

function isObj(o) {
    return typeof o === "object" && o !== null;
}

function isArray(o) {
    return Object.prototype.toString.call(o) === "[object Array]";
}
