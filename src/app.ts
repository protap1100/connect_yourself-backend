import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import config from "./config";
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// app.get("/api/users/register",async)

export default app;
