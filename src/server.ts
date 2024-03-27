import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./modules/user/route"
import instructorRoute from "./modules/instructor/route";
import adminRoute from "./modules/admin/route";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;


app.use(express.json())
app.use(cors({ credentials: true }));
app.use(cookieParser())



app.use("/",userRouter)
app.use("/admin",adminRoute)
app.use("/instructor",instructorRoute)



  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
  

