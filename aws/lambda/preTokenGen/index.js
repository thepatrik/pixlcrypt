const role = "pixlcrypt_user";

exports.handler = (event, context, callback) => {
    const email = event.request.userAttributes.email;
    event.response = {
        "claimsOverrideDetails": {
            "claimsToAddOrOverride": {
                "role": role
            }
        }
    };

    callback(null, event);
};
