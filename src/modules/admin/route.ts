import { Request, Response, NextFunction } from "express"; // Import Request and Response types
import express, { Application } from "express";
import AdminController from "./controller";

const controller = new AdminController()



const adminRoute: Application = express();

adminRoute.use(express.json()); // Add this line if you want to parse JSON request bodies


adminRoute.post('/login',controller.login)
adminRoute.get('/get-all-users',controller.getAllUsers)
adminRoute.get("/get-all-instructors",controller.getAllInstructors)
adminRoute.post("/user-block-unblock",controller.userBlockUnblock)
adminRoute.post("/instructor-block-unblock",controller.instructorBlockUnblock)
adminRoute.post("/add/category",controller.addCategory)
adminRoute.get("/get/categories",controller.getAllCategories)

 


export default adminRoute;
