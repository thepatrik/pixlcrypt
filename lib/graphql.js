"use strict";
const express = require("express");
const router = express.Router();
const { postgraphile } = require("postgraphile");

module.exports = opts => {
    /**
     * @api {post} /graphql
     * @apiVersion 1.0.0
     * @apiName GraphQL
     * @apiDescription GraphQL API
     * @apiGroup graphql
     * @apiHeader {String} Authorization Bearer schema and JWT token.
     * @apiHeader {String} x-api-key API key.
     * @apiHeaderExample {json} Header-Example:
     *      {
     *          "Authorization": "Bearer [token]",
     *          "x-api-key": "[key]"
     *      }
     * @apiParam {query} The graphql query
     * @apiExample {curl} Example usage:
     * curl -H "Authorization: Bearer [token]" -H "x-api-key: [key]" -H "Content-Type: application/json" -d '{"query":"allUsers{edges{node{nodeId,name,email}}}"}' -X POST https://api.pixlcrypt.com/graphql
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "data": {
     *              "allUsers": {
     *                  "edges": [
     *                      {
     *                          "node": {
     *                              "nodeId": "WyJ1c2VycyIsMV0=",
     *                              "name": "Patrik Palmér",
     *                              "email": "pixlcrypt@gmail.com"
     *                          }
     *                      }
     *                  ]
     *              }
     *          }
     *      }
     */
    router.use(postgraphile(process.env.DATABASE_URL || "postgres://localhost/", process.env.DATABASE_SCHEMA, opts));
    return router;
};
