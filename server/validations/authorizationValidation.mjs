import simplifiedValidation from "../utils/simplifiedValidation.mjs";

export const registrationValidation = simplifiedValidation({
    email: ["email", "length-6-254", "n-empty"],
    name: ["length-1-30", "n-empty"],
    surname: ["length-1-30", "n-empty"],
    password: ["length-8-64", "n-empty"]
});

export const loginValidation = simplifiedValidation({
    email: ["email", "length-6-254", "n-empty"],
    password: ["length-8-64", "n-empty"]
})
