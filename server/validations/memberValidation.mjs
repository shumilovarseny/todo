import simplifiedValidation from "../utils/simplifiedValidation.mjs";

export const deleteMemberValidation = simplifiedValidation({
    memberId: ["email", "length-6-254", "n-empty", "params"],
    projectId: ["int", "params"]
});

export const addMemberValidation = simplifiedValidation({
    projectId: ["int", "params"],
    userId: ["email", "length-6-254", "n-empty"],
});

export const putMemberValidation = simplifiedValidation({
    projectId: ["int", "params"],
    userId: ["email", "length-6-254", "n-empty"],
    roleId: ["in-s-a-m"],
});

export const getAllMembersValidation = simplifiedValidation({
    projectId: ["int", "params"],
    search: ["query"],
});

export const getAccessMembersValidation = simplifiedValidation({
    projectId: ["int", "params"],
    search: ["query"],
});

export const getNonMembersValidation = simplifiedValidation({
    projectId: ["int", "params"],
    search: ["query"],
});