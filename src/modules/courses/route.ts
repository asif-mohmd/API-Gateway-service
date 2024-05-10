import { Request, Response, NextFunction } from "express"; // Import Request and Response types
import express, { Application } from "express";
import courseController from "./controller";
import multer from "multer";

const controller = new courseController();

const courseRoute: Application = express();
const storage = multer.memoryStorage()
const upload = multer({storage})

courseRoute.use(express.json()); // Add this line if you want to parse JSON request bodies

courseRoute.post("/create-edit-course", upload.single('thumbnail') ,controller.createCourse );
courseRoute.get("/list-course" ,controller.listCourse );
courseRoute.get("/get-course-details/:id",controller.getCourseDetails)
courseRoute.post("/delete/course",controller.deleteCourse)
courseRoute.get("/get-all-user-courses",controller.getAllUserCourse)






export default courseRoute;
