import { Request, Response, NextFunction } from "express"; // Import Request and Response types
import express, { Application } from "express";
import courseController from "./controller";

const controller = new courseController();

const courseRoute: Application = express();

courseRoute.use(express.json()); // Add this line if you want to parse JSON request bodies

courseRoute.post("/create-edit-course",controller.createCourse );
courseRoute.get("/list-course" ,controller.listCourse );
courseRoute.get("/get-course-details/:id",controller.getCourseDetails)
courseRoute.post("/delete/course",controller.deleteCourse)







export default courseRoute;
