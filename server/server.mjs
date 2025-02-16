import express from "express";
import { } from "./database/database.mjs";
import authorizationRouter from "./routers/authorizationRouter.mjs";
import cookieParser from "cookie-parser";
import verifyTokenMiddleware from "./middlewares/verifyTokenMiddleware.mjs"
import usersRouter from "./routers/usersRouter.mjs";
import projectsRouter from "./routers/projectsRouter.mjs";
import membersRouter from "./routers/membersRouter.mjs";
import tasksRouter from "./routers/tasksRouter.mjs";
import cors from 'cors';
import multer from 'multer';
(await import('dotenv')).config();

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${file.originalname.split('.').pop()}`;
        cb(null, fileName);
    }
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(multer({ storage }).any())
app.use('/uploads', express.static('./uploads'));

const PORT = process.env.SERVER_PORT;
const HOST = process.env.SERVER_HOST;

app.use('/authorization', authorizationRouter);
app.use('/users', verifyTokenMiddleware, usersRouter);
app.use('/projects', verifyTokenMiddleware, projectsRouter);
app.use('/projects', verifyTokenMiddleware, membersRouter);
app.use('/tasks', verifyTokenMiddleware, tasksRouter);

app.listen(PORT, HOST, () => {
    console.log(`Сервер был запущен на http://${HOST}:${PORT}`);
}).on('error', (e) => {
    console.log('Ошибка: ', e.message)
});