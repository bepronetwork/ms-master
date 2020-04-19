
const security_object = (object) => {
    return {
        "security": !object.security ? {} : (object.security['2fa_set'] && object.security['bearerToken']) == undefined ? object.security : {
            "_id": object.security._id,
            "id": object.security._id,
            "2fa_set": object.security['2fa_set'],
            "email_verified": object.security.email_verified,
            "bearerToken": object.security['bearerToken'],
        },
    }
}


export {
    security_object
}