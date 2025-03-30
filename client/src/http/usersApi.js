import $host from "./index";

export const $getUser = async (email) => {
    try {
        const { data } = await $host.get(`/users/${email}`);
        return data;
    } catch (e) {
        return e.response.data;
    }
}

export const $editUser = async ({ email, name, surname, password, dateOfBirth, genderId, image }) => {
    try {
        const payload = { email, name, surname, password, dateOfBirth, genderId, image };
        const formData = new FormData();
        for (let key in payload) {
            if (payload[key] != null) formData.append(key, payload[key])
        }
        const { data } = await $host.put(`/users/`, formData);
        return data;
    } catch (e) {
        return e.response.data;
    }
};

export const $deleteUser = async () => {
    try {
        const { data } = await $host.delete(`/users/`);
        return data;
    } catch (e) {
        return e.response.data;
    }
};

export const $changeEmail = async (newEmail) => {
    try {
        const data = await $host.put('/users/change-email', { newEmail })
        return data;
    } catch (e) {
        return e.response.data;
    }
}

export const $changePassword = async (password, newPassword) => {
    try {
        const data = await $host.put('/users/change-password', { password, newPassword })
        return data;
    } catch (e) {
        return e.response.data;
    }
}