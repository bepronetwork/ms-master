export const GenerateLink = {

    confirmEmail: (param) => {
        return `${param[0]}confirm?token=${param[1]}`;
    },
    resetPassword: (param) => {
        return `${param[0]}password/reset?token=${param[1]}&userId=${param[2]}`;
    }
}
