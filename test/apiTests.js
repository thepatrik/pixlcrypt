"use strict";
const expect = require("chai").expect;
const request = require("supertest");
const app = require("../lib/app");
const awsHelper = require("../lib/awsHelper");
const s3Url = "https://s3-eu-west-1.amazonaws.com/pixlcrypt-content/users/pixlcrypt%40gmail.com/src/28973449265_07e3aa5d2e_b.jpg";
const flickrUrl = "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg";
const username = process.env.TEST_USER_USERNAME;
const password = process.env.TEST_USER_PASSWORD;
const expiredToken = "eyJraWQiOiJZUGhOZWZYY3piS01qcFdaY3dmbjZyb01Wa0xwNzJnbyt2SFpsaVMrSHFjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5NDU5YjlmMy1mOTQ5LTRlMDEtOTY3YS0yMTIwYWEzZTA5YzAiLCJjb2duaXRvOmdyb3VwcyI6WyJldS13ZXN0LTFfVWpnV2JCZ1E4X0dvb2dsZSJdLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6InBob25lIG9wZW5pZCBodHRwczpcL1wvYXBpLnBpeGxjcnlwdC5jb21cL3Bob3Rvczp3cml0ZSBlbWFpbCIsImF1dGhfdGltZSI6MTUyOTY2MDc0NCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfVWpnV2JCZ1E4IiwiZXhwIjoxNTI5NjY0MzQ0LCJpYXQiOjE1Mjk2NjA3NDYsInZlcnNpb24iOjIsImp0aSI6IjEzNDc2Mjc5LTU0YWEtNGRlMy05YzQ2LTE3ZDhjOGJjMzdkNiIsImNsaWVudF9pZCI6IjU0MmZ1OGk0bmZiNGVja245NWo0dWVrMW02IiwidXNlcm5hbWUiOiJHb29nbGVfMTAwMjIyMjMyODk0Njc2MjkyNTIzIn0.J23_fE7Drd2ch4MjjoKmQEP2pYftqtEYioSXYGO5tk_MRQJA7YieN0sj3cD2fDtggBAzDTn5nfM0eXNeagdd9erZ97YhJjAOhhF9QoGxBOKCe96MkheHdjZGFkr4DAb2_cEoLqiGWYaPtnmGhvk1GPLZnnBb5dLRcvArloXkBIoylKuDY6PskJsTVv7Q4U8pFH_ZzLCNkiTMGIEk9KiEOTJ8B-ID4AuRjWuaLyDtihJSTZdRds0x0U1lWWtlnD1XvuC3PZPaB4VaQ2flVf1m5vO3_S275Acpv6FwmgjWcbkW_KX7WnqMHNznpRcIgsZXfu2OrP1osjG12NRnOF3Xyw";
let token;

describe("HTTP GET /health", () => {
    it("200 - ok", done => {
        request(app)
            .get("/health")
            .expect(200, done);
    });
});

describe("Fetch development access token", () => {
    it("Fetch token", done => {
        awsHelper.getToken(username, password).then(res => {
            token = res;
            expect(token).to.not.be.empty;
            done();
        }).catch(err => {
            console.log(err);
            expect(token).to.not.be.empty;
        });
    });
});

describe("HTTP POST /presign", () => {
    it("401 - unauthorized", done => {
        request(app)
            .post("/presign")
            .expect(401, done);
    });
    it("400 - no urls sent", done => {
        request(app)
            .post("/presign")
            .set("Authorization", "Bearer " + token)
            .expect(400, done);
    });
    it("200 - ok", done => {
        request(app)
            .post("/presign")
            .set("Authorization", "Bearer " + token)
            .send({urls: s3Url + "," + s3Url})
            .expect(res => {
                expect(res.body.length).to.equal(2);})
            .expect(200, done);
    });
    it("200 (no s3 urls) - ok", done => {
        request(app)
            .post("/presign")
            .set("Authorization", "Bearer " + token)
            .send({urls: flickrUrl + "," + flickrUrl})
            .expect(res => {
                expect(res.body.length).to.equal(0);})
            .expect(200, done);
    });
});

describe("HTTP GET /presign", () => {
    it("401 - unauthorized", done => {
        request(app)
            .get("/presign")
            .expect(401, done);
    });
    it("400 - no url sent", done => {
        request(app)
            .get("/presign")
            .set("Authorization", "Bearer " + token)
            .expect(400, done);
    });
    it("400 (no s3 url) - ok", done => {
        request(app)
            .get("/presign?url=" + flickrUrl)
            .set("Authorization", "Bearer " + token)
            .expect(res => {
                expect(res.body).to.be.empty;})
            .expect(400, done);
    });
    it("200 - ok", done => {
        request(app)
            .get("/presign?url=" + s3Url)
            .set("Authorization", "Bearer " + token)
            .expect(res => {
                expect(res.body.url).to.not.be.empty;})
            .expect(200, done);
    });
    it("200 (putObject) - ok", done => {
        request(app)
            .get("/presign?url=" + s3Url + "&operation=putObject")
            .set("Authorization", "Bearer " + token)
            .expect(res => {
                expect(res.body.url).to.not.be.empty;})
            .expect(200, done);
    });
});

describe("HTTP GET 404", () => {
    it("404 - not found", done => {
        request(app)
            .get("/abracadabra")
            .set("Authorization", "Bearer " + token)
            .expect(404, done);
    });
});

describe("HTTP POST /graphql allUsers", () => {
    it("401 - expired token", done => {
        request(app)
            .post("/graphql")
            .set("Authorization", "Bearer " + expiredToken)
            .send({query: `{
                allUsers {
                    edges {
                        node {
                            nodeId,
                            name,
                            email
                        }
                    }
                }
            }`})
            .type("form")
            .expect(401, done);
    });
    it("200 - ok", done => {
        request(app)
            .post("/graphql")
            .set("Authorization", "Bearer " + token)
            .send({query: `{
                allUsers {
                    edges {
                        node {
                            nodeId,
                            name,
                            email
                        }
                    }
                }
            }`})
            .type("form")
            .expect(res => {
                expect(res.body.data.allUsers.edges.length).to.equal(1);})
            .expect(200, done);
    });
});

describe("HTTP POST /graphql allItems", () => {
    it("200 - ok", done => {
        request(app)
            .post("/graphql")
            .set("Authorization", "Bearer " + token)
            .send({query: `{
                allItems {
                    edges {
                        node {
                            nodeId
                        }
                    }
                }
            }`})
            .type("form")
            .expect(res => {
                expect(res.body.data.allItems.edges.length).to.equal(25);})
            .expect(200, done);
    });
});

describe("HTTP POST /graphql allItems (first 10)", () => {
    it("200 - ok", done => {
        request(app)
            .post("/graphql")
            .set("Authorization", "Bearer " + token)
            .send({query: `{
                allItems (first: 10) {
                    edges {
                        node {
                            nodeId
                            src
                            caption
                            description
                            itemTagsByItemId {
                                edges {
                                    node {
                                        tagByTagId {
                                            key
                                            val
                                        }
                                    }
                                }
                            }
                            thumbsByItemId {
                                edges {
                                    node {
                                        src
                                        height
                                        width
                                    }
                                }
                            }
                        }
                    }
                }
            }`})
            .type("form")
            .expect(res => {
                expect(res.body.data.allItems.edges.length).to.equal(10);})
            .expect(200, done);
    });
});
