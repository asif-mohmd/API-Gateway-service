import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./modules/user/route"

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;


app.use(express.json())
app.use(cors({ credentials: true }));
app.use(cookieParser())



// app.post("/register", (req: Request, res: Response) => {
//   console.log(req.body)
//   res.send("Express + TypeScript Server " +req.body);
// });

app.use("/",userRouter)
// app.use("/admin",adminRoute)
// app.use("/instructor",instructorRoute)

// app.use("/",(req:Request,res:Response)=>{

// })


  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
  

