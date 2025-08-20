import express from "express";
import dbConnection  from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import "./utils/GoogleOath.js";
import passport from 'passport';
import paymentRouter from "./routes/paymentRoutes.js";



const app = express();
config({ path: "./config/config.env" });


dbConnection();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT","PATCH"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(passport.initialize());



app.use("/auth", userRouter);
app.use("/job", jobRouter);
app.use("/api/v1/user", userRouter);
app.use("/application", applicationRouter);
app.use("/payment", paymentRouter);




app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});

