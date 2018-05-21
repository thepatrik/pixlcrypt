"use strict";
require("dotenv").config({silent: true});
const app = require("./app");
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Node app is running on port", port); // eslint-disable-line no-console
    console.log("Environment is", process.env.NODE_ENV); // eslint-disable-line no-console
});
