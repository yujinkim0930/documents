import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import expressMySQLSession from "express-mysql-session";
import UsersRouter from "./routers/users.router.js";
import DocumentsRouter from "./routers/documents.router.js";

dotenv.config();

const app = express();
const PORT = 3018;

const MySQLStore = expressMySQLSession(expressSession);
const sessionStore = new MySQLStore({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  expiration: 1000 * 60 * 60 * 24, //1일
  createDatabaseTable: true,
});
app.use(express.json());
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 12, //12시간동안 쿠키 사용하도록 설정
    },
    store: sessionStore,
  })
);

app.use([UsersRouter, DocumentsRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
