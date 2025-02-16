import $host from "./index";

export const $getImage = async (url) => {
    try {
        const { data } = await $host.get(url);
        if (data) return url
        return null;
    } catch {
        return null;
    }
}