import { Request, Response, NextFunction } from "express"; // Import Request and Response types
import express, { Application } from "express";
import { login, otp, register } from "./controller";

const instructorRoute: Application = express();

instructorRoute.use(express.json()); // Add this line if you want to parse JSON request bodies

instructorRoute.post("/register",register);
instructorRoute.post('/login',login)
instructorRoute.post("/otp",otp)

export default instructorRoute;
