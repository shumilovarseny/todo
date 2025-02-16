import $host from "./index";

export const $registration = async (email, name, surname, password) => {
    try {
        const { data } = await $host.post('/authorization/registration', {
            email,
            name,
            surname,
            password
        });
        return data;
    } catch (e) {
        return e.response.data;
    }
}

export const $login = async (email, password) => {
    try {
        const { data } = await $host.post("/authorization/login", { email, password });
        return data
    } catch (e) {
        return e.response.data;
    }
};

export const $logout = async () => {
    try {
        const { data } = await $host.post("/authorization/logout", {});
        return data
    } catch (e) {
        return e.response.data;
    }
};