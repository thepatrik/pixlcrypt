"use strict";
const FWD_HEADER = "x-forwarded-proto";
const HTTPS = "https";

module.exports.isSecure = req => {
    return req.secure || req.header(FWD_HEADER) === HTTPS;
};
