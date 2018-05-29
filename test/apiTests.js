"use strict";
/* jshint -W030 */
const expect = require("chai").expect;
const request = require("supertest");
const app = require("../lib/app");
const awsHelper = require("../lib/awsHelper");
const username = process.env.TEST_USER_USERNAME;
const password = process.env.TEST_USER_PASSWORD;
let token;

describe("HTTP POST /graphql allItems", () => {
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
    it("200 - ok", done => {
        request(app)
            .post("/graphql")
            .set("Authorization", "Bearer " + token)
            .send({query: `{
                allItems {
                    edges {
                        node {
                            id
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
                allItems (first:10) {
                edges {
                    node {
                    id
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
