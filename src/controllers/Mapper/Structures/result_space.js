
const result_space_object = (object) => {
    return {
        "resultSpace": !object.resultSpace ? [] : object.resultSpace.map(result_space => {
            return ({
                "_id": result_space._id,
                "formType": result_space.formType,
                "probability": result_space.probability,
                "multiplier": result_space.multiplier,
                "__v": result_space.__v,
            })
        }),
    }
}


export {
    result_space_object
}