import $host from "./index";

export const $getProjects = async (search, status) => {
    try {
        const { data } = await $host.get(`/projects/?search=${search}&status=${status}`);
        return data;
    } catch (e) {
        return e.response.data;
    }
}

export const $getProject = async (projectId) => {
    try {
        const { data } = await $host.get(`/projects/${projectId}`);
        return data;
    } catch (e) {
        return e.response.data;
    }
}

export const $deleteProject = async (projectId) => {
    try {
        const { data } = await $host.delete(`/projects/${projectId}`);
        return data;
    } catch (e) {
        return e.response.data;
    }
}

export const $createProject = async ({ name, description, image }) => {
    try {
        const formData = new FormData();
        const payload = { name, description, image };
        Object.entries(payload).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        })
        const { data } = await $host.post(`/projects/`, formData);
        return data;
    } catch (e) {
        return e.response.data;
    }
}

export const $editProject = async ({ name, description, status, projectId, image }) => {
    try {
        const formData = new FormData();
        const payload = { name, description, status, projectId, image };
        for (let key in payload) {
            formData.append(key, payload[key])
        }
        const { data } = await $host.put(`/projects/`, formData);
        return data;
    } catch (e) {
        return e.response.data;
    }
}

export const $getMembers = async (projectId, alreadyMember, search, access = false) => {
    try {
        let path = "";
        if (!alreadyMember) path = "non/";
        else if (access) path = "access/";
        const { data } = await $host.get(`/projects/${projectId}/members/${path}?search=${search}`);
        return data;
    } catch (e) {
        return e.response.data;
    }
}

export const $addMember = async (userId, projectId) => {
    try {
        const { data } = await $host.post(`/projects/${projectId}/members/`, {
            userId
        });
        return data;
    } catch (e) {
        return e.response.data;
    }
}

export const $deleteMember = async (userId, projectId) => {
    try {
        const { data } = await $host.delete(`/projects/${projectId}/members/${userId}`);
        return data;
    } catch (e) {
        return e.response.data;
    }
}

export const $editMemberRole = async (userId, projectId, roleId) => {
    try {
        const { data } = await $host.put(`/projects/${projectId}/members/`, {
            userId,
            roleId
        });
        return data;
    } catch (e) {
        return e.response.data;
    }
}