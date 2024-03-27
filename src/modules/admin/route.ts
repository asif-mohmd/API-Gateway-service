import { Request, Response, NextFunction } from "express"; // Import Request and Response types
import express, { Application } from "express";
import { login } from "./controller";

const adminRoute: Application = express();

adminRoute.use(express.json()); // Add this line if you want to parse JSON request bodies


adminRoute.post('/login',login)

export default adminRoute;
