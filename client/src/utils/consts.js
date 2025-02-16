import { IMAGE_PATH, SERVER_HOST, SERVER_PORT } from "../../env";

export const FILTERS = ["today", "planned", "completed", "overdue"];

export const TASKS_TABS = [
    {
        name: "Сегодня",
        link: "today"
    },
    {
        name: "Запланированные",
        link: "planned"
    },
    {
        name: "Выполненные",
        link: "completed"
    },
    {
        name: "Просроченные",
        link: "overdue"
    },
];

export const SORT_TASKS_OPTIONS = [
    {
        value: "name",
        name: "По алфавиту"
    },
    {
        value: "dueDate",
        name: "По сроку сдачи"
    },
    {
        value: "priority",
        name: "По важности"
    },
];

export const MODAL_WINDOW_BUTTON = [
    { value: "dueDate", name: "Срок" },
    { value: "project", name: "Проект" },
    { value: "executor", name: "Ответственный" },
    { value: "description", name: "Комментарий" },
];

export const PROJECT_INFO_SELECT_ACTIVE = [
    { name: "Активен", value: true },
    { name: "Завершен", value: false },
];

export const PROJECTS_SELECT_ACTIVE = [
    { name: "Все", value: "all" },
    { name: "Активные", value: "active" },
    { name: "Завершенные", value: "inactive" },
];

export const MEMBERS_ROLES = [
    { name: "Супер-админ", value: "s" },
    { name: "Админ", value: "a" },
    { name: "Участник", value: "m" },
];

export const UPLOAD_IMAGE_PATH = `http://${SERVER_HOST}:${SERVER_PORT}/${IMAGE_PATH}`;