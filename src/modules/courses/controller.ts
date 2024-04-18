import { Request, Response, NextFunction } from "express";

import { StatusCode } from "../../interfaces/enums";
import { CourseClient } from "./config/grpc-client/courseClient";


export default class courseController {

createCourse = (req: Request, res: Response, next: NextFunction) => {
    console.log("rehgiiiiiiiiiiiiiiii",req.body.values)
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