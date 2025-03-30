import $host from "./index";

export const $createTask = async (name, dueDate, description, priority, projectId) => {
    try {
        const { data } = await $host.post('/tasks', {
            name,
            dueDate,
            description,
            priority,
            projectId
        });
        return data;

    } catch (e) {
        return e.response.data;
    }
}

export const $addExecutors = async (taskId, memberId) => {
    try {
        const { data } = await $host.post('/tasks/add-executor', {
            taskId,
            memberId
        });
        return data;

    } catch (e) {
        return e.response.data;
    }
}

export const $getTasks = async (projects, search, sort, direction, filter, type) => {
    try {
        const projectsQuery = Object.entries(projects).map(([key, value]) => {
            if (value) return `projects[]=${key}`
        }).filter((value) => value).join('&')
        let path = `/tasks/?${projectsQuery}`;
        const { data } = await $host.get(path, {
            params: {
                search,
                sort,
                direction,
                filter,
                type
            }
        });
        return data;

    } catch (e) {
        return e.response.data;
    }
}

export const $changeStatusTask = async (id, status) => {
    try {
        const { data } = await $host.put('/tasks/status', {
            id,
            status
        });
        return data;

    } catch (e) {
        return e.response.data;
    }
}