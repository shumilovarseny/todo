import axios from "axios";
import { SERVER_HOST, SERVER_PORT } from "../../env";

const $host = axios.create({
    baseURL: `http://${SERVER_HOST}:${SERVER_PORT}`,
    withCredentials: true,
    credentials: 'include'
})

export default $host;