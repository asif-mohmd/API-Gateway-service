import express, { Application } from "express";
import { isValidatedAdmin, isValidatedInstructor, isValidatedUser } from "./controllers";

const authRoute: Application = express();

authRoute.use(express.json()); // Add this line if you want to parse JSON request bodies


authRoute.get('/isValidatedUser',isValidatedUser)
authRoute.get('/isValidatedInstructor',isValidatedInstructor)
authRoute.get('/isValidatedAdmin',isValidatedAdmin)


export default authRoute;
