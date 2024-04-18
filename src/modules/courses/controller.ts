import { Request, Response, NextFunction } from "express";

import { StatusCode } from "../../interfaces/enums";
import { CourseClient } from "./config/grpc-client/courseClient";
import jwt from "jsonwebtoken"

export default class courseController {

createCourse = (req: Request, res: Response, next: NextFunction) => {
    console.log("rehgiiiiiiiiiiiiiiii",req.body.values)
    const instructorData = req.cookies.instructorData;
    console.log(instructorData)
    const decoded: any = jwt.verify(instructorData.token, process.env.JWT_SECRET || "");
      console.log(decoded,"iam deco")
    CourseClient.CreateCourse(req.body.values, (err: Error, result: any) => {
      if (err) {
        res.status(StatusCode.Unauthorized).json({ message: err });
        console.log("err in API gateway");
      } else {
        console.log("----", result, "----------------");
        if (result.registerStatus) {
          console.log(result.instructorData,"instructtttttDatatatatatat")
  
          res.cookie("instructorData", result.instructorData, {
            httpOnly: true,
          });
          res.json({ status:true });
        } else {
          res.json({ status:false });
        }
      }
    });
  };

}