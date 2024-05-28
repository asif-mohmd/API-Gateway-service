import { Request, Response, NextFunction } from "express"; // Import Request and Response types
import express, { Application } from "express";
import courseController from "./controller";
import multer from "multer";
import { isValidatedInstructor, isValidatedUser } from "../auth/controllers";

const controller = new courseController();

const courseRoute: Application = express();
const storage = multer.memoryStorage()
const upload = multer({storage})

courseRoute.use(express.json()); // Add this line if you want to parse JSON request bodies

courseRoute.post("/create-edit-course",isValidatedInstructor, upload.single('thumbnail') ,controller.createCourse );
courseRoute.get("/list-course" ,isValidatedInstructor,controller.listCourse );
courseRoute.get("/get-course-details/:id",controller.getCourseDetails)
courseRoute.post("/delete/course",isValidatedInstructor,controller.deleteCourse)
courseRoute.get("/get-all-user-courses",controller.getAllUserCourse)

courseRoute.post("/user/purchased/courses",isValidatedUser,controller.getUserPurchasedCourses)
courseRoute.post('/user/add/question', controller.addQuestion)
courseRoute.post('/user/add/answer', controller.addAnswer)






export default courseRoute;
