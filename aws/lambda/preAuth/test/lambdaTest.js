const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const ix = require('../index.js');

let file = 'test/event.json'

readFileAsync(file).then(res => {
    let event = JSON.parse(res);
    ix.handler(event, null, () => {});
});
