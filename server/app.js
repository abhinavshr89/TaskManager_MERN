import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb  from "./Database/db.js";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js"; // Change here
import userRouter from "./Router/userRouter.js";
import taskRouter from "./Router/taskRouter.js"


const app = express();


app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "PUT", "DELETE", "POST"],
        credentials: true,
    })
);

dotenv.config({ path: "./config/config.env" });

//==> Middlewares =================================

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//===> using fileUpload Middleware ================
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);


///===> using Rouer Middleware ================

app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter); // Add a missing slash
//===> Connecting to the MongoDB databse =========
connectDb();
app.use(errorMiddleware);

export default app;
