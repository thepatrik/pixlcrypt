"use strict";
const express = require("express");
const router = express.Router();

/**
 * @api {get} /health Get health
 * @apiVersion 1.0.0
 * @apiName GetHealth
 * @apiDescription Get health, returns success (200).
 * @apiGroup Health
 * @apiPermission None
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 */
router.get("/health", (req, res) => {
    res.sendStatus(200);
});

module.exports = router;
