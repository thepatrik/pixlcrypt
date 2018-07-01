require("dotenv").config({silent: true});
const { Client } = require('pg')

async function verifyEmail(email) {
    const client = new Client();

    await client.connect();

    const res = await client.query('SELECT id from pixlcrypt.user where email=$1', [email]);
    await client.end();
    return res.rowCount > 0;
}

exports.handler = async (event, context, callback) => {
    const email = event.request.userAttributes.email;

    let isOk = await verifyEmail(email);
    if (!isOk) {
        const err = new Error("Did not find email: " + email + ", in db.");
        callback(err, event);
    }

    callback(null, event);
};
