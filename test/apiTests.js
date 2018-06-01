"use strict";
/* jshint -W030 */
const expect = require("chai").expect;
const request = require("supertest");
const app = require("../lib/app");
const awsHelper = require("../lib/awsHelper");
const s3Url = "https://s3-eu-west-1.amazonaws.com/pixlcrypt-content/users/pixlcrypt%40gmail.com/src/28973449265_07e3aa5d2e_b.jpg";
const username = process.env.TEST_USER_USERNAME;
const password = process.env.TEST_USER_PASSWORD;
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
    it("200 - ok", done => {
        request(app)
            .get("/presign?url=" + s3Url)
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
                expect(res.body.data.allItems.edges.length).to.equal(24);})
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
