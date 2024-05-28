import express, { Application } from "express";
import UserController from "./controller";
import { isValidatedUser } from "../auth/controllers";
import multer from "multer";

const userRoute: Application = express();

const storage = multer.memoryStorage()
const upload = multer({storage})
userRoute.use(express.json()); // Add this line if you want to parse JSON request bodies
const controller = new UserController();

userRoute.post("/register", controller.register);
userRoute.post("/login", controller.login);
userRoute.post("/otp", controller.otp);

userRoute.post("/forgotpassword", controller.forgotPassword);
userRoute.post("/forgototp", controller.forgotOtp);

userRoute.get("/user/details",isValidatedUser,controller.onGetUserDetails)

userRoute.post("/create/user/order",controller.createUserCourse)
userRoute.post("/upload/avatar",upload.single("avatar"),controller.uploadAvatar)

export default userRoute;
 