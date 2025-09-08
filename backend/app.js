import express from "express";
import session from "express-session";
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
import http from "http";
import {Server} from "socket.io";
config({ path: "./config/config.env" });
import NotificationRouter from "./routes/notificationRoutes.js";
import StatsRouter from "./routes/statsRoutes.js";


const app = express();
const server=http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: process.env.FRONTEND_URL,  // e.g. "http://localhost:5173"
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Map to store userId <-> socketId
const userSocketMap = {};
dbConnection();

io.on("connection",(socket)=>{
  console.log("New client connected",userSocketMap);
  socket.on("registerUser",(userId)=>{
    userSocketMap[userId._id] = socket.id;
    console.log("User registered",{userId,socketId:socket.id});
  });
  socket.on("disconnect", () => {
    // Remove user from map on disconnect
    for (const [userId, id] of Object.entries(userSocketMap)) {
      if (id === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    console.log("Client disconnected",socket.id);
  });
});



app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT","PATCH"],
    credentials: true,
  })
);


// Add express-session middleware for Google OAuth role persistence
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

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
app.use("/notifications", NotificationRouter);
app.use("/job", jobRouter);
app.use("/api/v1/user", userRouter);
app.use("/application", applicationRouter);
app.use("/payment", paymentRouter);
app.use("/stats", StatsRouter);




app.use(errorMiddleware);
server.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});

export { io, userSocketMap };