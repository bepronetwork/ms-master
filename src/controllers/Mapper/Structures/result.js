
const result_object = (object) => {
    return {
        "result": object.result ? object.result.map(result_id => {
            return ({
                "_id": result_id
            })
        }) : object.result,
    }
}


export {
    result_object
}