import $host from "./index";

export const $createTask = async (name, dueDate, description, priority, projectId, executorEmail) => {
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
        let path = `/tasks/`;
        if (projects.length) path += "?projects[]=" + projects.join(`&&projects[]=`);

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