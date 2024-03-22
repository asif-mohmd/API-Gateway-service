import { Request, Response, NextFunction } from "express"; // Import Request and Response types
import express, { Application } from "express";
import { register } from "./controller";

const userRoute: Application = express();

userRoute.use(express.json()); // Add this line if you want to parse JSON request bodies

userRoute.post("/register", register);

export default userRoute;
