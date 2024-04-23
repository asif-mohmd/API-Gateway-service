import { Request, Response, NextFunction } from "express"; // Import Request and Response types
import express, { Application } from "express";
import InstructorController from "./controller";

const controller = new InstructorController();

const instructorRoute: Application = express();

instructorRoute.use(express.json()); // Add this line if you want to parse JSON request bodies

instructorRoute.post("/register", controller.register);
instructorRoute.post("/login", controller.login);
instructorRoute.post("/otp", controller.otp);
instructorRoute.get("/profile/page",controller.profile)



export default instructorRoute;
