import simplifiedValidation from "../utils/simplifiedValidation.mjs";

export const projectCreateValidation = simplifiedValidation({
    name: ["length-1-30", "n-empty"],
    description: ["length-0-250"]
});

export const projectUpdateValidation = simplifiedValidation({
    name: ["length-1-30", "n-empty"],
    description: ["length-0-250"],
    status: ["boolean", "n-empty"],
    projectId: ["int"],
});

export const getProjectValidation = simplifiedValidation({
    projectId: ["int", "params"]
});

export const getProjectsValidation = simplifiedValidation({
    status: ["in-all-active-inactive", "query"],
    search: ["query"],
});

export const deleteProjectValidation = simplifiedValidation({
    projectId: ["int", "params"]
});