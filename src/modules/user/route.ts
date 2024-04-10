import express, { Application } from "express";
import { forgotOtp, forgotPassword, login, otp, register } from "./controller";

const userRoute: Application = express();

userRoute.use(express.json()); // Add this line if you want to parse JSON request bodies

userRoute.post("/register", register);
userRoute.post('/login',login)
userRoute.post("/otp",otp)

userRoute.post("/forgotpassword",forgotPassword)
userRoute.post("/forgototp",forgotOtp)

export default userRoute;
