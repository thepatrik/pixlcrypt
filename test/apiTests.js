"use strict";
/* jshint -W030 */
const expect = require("chai").expect;
const request = require("supertest");
const app = require("../lib/app");

describe("HTTP POST /graphql allItems", () => {
    it("200 - ok", done => {
        request(app)
            .post("/graphql")
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
