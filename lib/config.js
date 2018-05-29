"use strict";
const DEV = "development";
const PROD = "production";

module.exports.SERVER = {
    env: process.env.NODE_ENV,
    isProduction: (process.env.NODE_ENV || DEV) === PROD
};

module.exports.auth = {
    clientId: "542fu8i4nfb4eckn95j4uek1m6"
};

module.exports.aws = {
    authKeys: {
        public: {
            bucket: "pixlcrypt-public-auth",
            key: "public.pem"
        }
    },
    region: "eu-west-1"
};
