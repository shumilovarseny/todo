import simplifiedValidation from "../utils/simplifiedValidation.mjs";

export const userInfoValidation = simplifiedValidation({
    userId: ["email", "length-6-254", "n-empty", "params"],
})

export const userPutDataValidation = simplifiedValidation({
    email: ["email", "length-6-254", "n-empty"],
    name: ["length-1-30", "n-empty"],
    surname: ["length-1-30", "n-empty"],
    genderId: ["in-f-m", "optional"],
    dateOfBirth: ["date-between-1900.01.01-now", "optional"],
    image: ["length-0-500", "optional"]
});