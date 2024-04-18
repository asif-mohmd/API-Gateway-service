import express, { Application } from "express";
import UserController from "./controller";

const userRoute: Application = express();

userRoute.use(express.json()); // Add this line if you want to parse JSON request bodies
const controller = new UserController();

userRoute.post("/register", controller.register);
userRoute.post("/login", controller.login);
userRoute.post("/otp", controller.otp);

userRoute.post("/forgotpassword", controller.forgotPassword);
userRoute.post("/forgototp", controller.forgotOtp);

export default userRoute;
