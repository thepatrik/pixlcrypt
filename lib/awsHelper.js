"use strict";
const AWS = require("aws-sdk");
const config = require("./config");
AWS.config.region = config.aws.region;

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
