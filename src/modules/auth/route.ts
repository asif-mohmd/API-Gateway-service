import express, { Application } from "express";
import { isValidated } from "./controllers";

const authRoute: Application = express();

authRoute.use(express.json()); // Add this line if you want to parse JSON request bodies


authRoute.post('/isValidated',isValidated)

export default authRoute;