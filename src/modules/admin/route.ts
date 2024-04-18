import { Request, Response, NextFunction } from "express"; // Import Request and Response types
import express, { Application } from "express";
import AdminController from "./controller";

const controller = new AdminController()



const adminRoute: Application = express();

adminRoute.use(express.json()); // Add this line if you want to parse JSON request bodies


adminRoute.post('/login',controller.login)

export default adminRoute;
