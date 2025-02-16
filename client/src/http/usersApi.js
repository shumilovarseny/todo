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
        const filteredEntries = Object.fromEntries(
            Object.entries(payload).filter(([, value]) => value != null)
        );
        const { data } = await $host.put(`/users/`, filteredEntries);
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