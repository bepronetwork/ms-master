
const permission_object = (object) => {
    return {
        "permission": !object.permission ? {} : (object.permission.super_admin && object.permission.withdraw) == undefined ? object.permission._id : {
            "_id": object.permission._id,
            "super_admin": object.permission.super_admin,
            "customization": object.permission.customization,
            "withdraw": object.permission.withdraw,
            "user_withdraw": object.permission.user_withdraw,
            "financials": object.permission.financials
        },
    }
}


export {
    permission_object
}