import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./modules/user/route";
import instructorRoute from "./modules/instructor/route";
import adminRoute from "./modules/admin/route";
import courseRoute from "./modules/courses/route";

import RabbitMQClient from "./rabbitMQ/client";
import bodyParser from "body-parser"


 
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());


// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// app.use(
//   cors({
//     credentials: true,
//   })
// );

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials:true
}));

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

app.use("/", userRouter);
app.use("/admin", adminRoute);
app.use("/instructor", instructorRoute);
app.use("/course", courseRoute);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  RabbitMQClient.initialize()
});
