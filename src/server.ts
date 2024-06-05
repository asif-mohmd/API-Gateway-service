import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./modules/user/route";
import instructorRoute from "./modules/instructor/route";
import adminRoute from "./modules/admin/route";
import courseRoute from "./modules/courses/route";

import RabbitMQClient from "./modules/courses/rabbitMQ/client";
import bodyParser from "body-parser"
import orderRoute from "./modules/order/route";

import healthCheckRouter from "./utils/healthcheck";
 
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5001;

app.use(express.json());


app.use(cors({
  origin: 'http://localhost:5000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials:true
}));

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

app.use("/", userRouter);
app.use("/admin", adminRoute);
app.use("/instructor", instructorRoute);
app.use("/course", courseRoute);
app.use("/order", orderRoute)


// app.use("/health", healthCheckRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  RabbitMQClient.initialize()
});
