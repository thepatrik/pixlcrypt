"use strict";
const expect = require("chai").expect;
const awsHelper = require("../lib/awsHelper");
const s3Url1 = "https://s3-eu-west-1.amazonaws.com/pixlcrypt-content/users/pixlcrypt%40gmail.com/src/28973449265_07e3aa5d2e_b.jpg";
const s3Url2 = "https://s3-eu-west-1.amazonaws.com/pixlcrypt-content/users/pixlcrypt22%40gmail.com/src/28973449265_07e3aa5d2e_b.jpg";
const s3Url3 = "https://s3-eu-west-1.amazonaws.com/pixlcrypt-somethingelse/users/pixlcrypt%40gmail.com/src/28973449265_07e3aa5d2e_b.jpg";

describe("isS3Url tests", () => {
    it("Should be a valid s3 url", () => {
        expect(awsHelper.isS3Url(s3Url1));
    });
});

describe("getS3Obj tests", () => {
    it("Should be able to fetch bucket and key from url", () => {
        let s3Obj = awsHelper.toS3Obj(s3Url1);
        expect(s3Obj.bucket).to.equal("pixlcrypt-content");
        expect(s3Obj.key).to.equal("users/pixlcrypt@gmail.com/src/28973449265_07e3aa5d2e_b.jpg");
    });
});

describe("getPresignedUrl tests", () => {
    it("Should be able to fetch a presigned url", done => {
        let s3Obj = awsHelper.toS3Obj(s3Url1);
        awsHelper.getPresignedUrlAsync(s3Obj.bucket, s3Obj.key).then(url => {
            expect(url).to.not.be.empty;
            done();
        });
    });
});

describe("isPresignPermitted tests", () => {
    it("Should be allowed to presign", () => {
        expect(awsHelper.isPresignPermitted(s3Url1, "pixlcrypt@gmail.com")).to.be.true;
    });
    it("Should not be allowed to presign (wrong username)", () => {
        expect(awsHelper.isPresignPermitted(s3Url2, "pixlcrypt@gmail.com")).to.be.false;
    });
    it("Should not be allowed to presign (wrong bucket)", () => {
        expect(awsHelper.isPresignPermitted(s3Url3, "pixlcrypt@gmail.com")).to.be.false;
    });
});
