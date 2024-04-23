import { Request, Response, NextFunction } from "express";
import { InstructorClient } from "./config/grpc-client/instructorClient";
import jwt from "jsonwebtoken"
import { StatusCode } from "../../interfaces/enums";


export default class InstructorController {



register = (req: Request, res: Response, next: NextFunction) => {
  console.log("rehgiiiiiiiiiiiiiiii")
    InstructorClient.Register(req.body.formData, (err: Error, result: any) => {
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

 otp = (req: Request, res: Response, next: NextFunction) => {
  const instructorData = req.cookies.instructorData;
  console.log(instructorData)
  const decoded: any = jwt.verify(instructorData.token, process.env.JWT_SECRET || "");
  if (req.body.otp === decoded.activationCode) {
    InstructorClient.ActivateInstructor(decoded.instructorData, (err: Error, result: any) => {
      if (err) {
        res.status(StatusCode.Unauthorized).json({ message: err });
      } else {
        if (result.status) {
          res.status(StatusCode.OK).json({ status: true });
        } else {
          res.status(StatusCode.Unauthorized).json({ status: false });
        }
      }
    });
  } else {
    res.status(401).json({ status: false });
  }
};

 login = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.instructorLoginData,"------------------------------")
    InstructorClient.Login(req.body.instructorLoginData, (err: Error, result: any) => {
  
    console.log("----------------- side",result,";;;;;;;;;;;;;;;;;;;;;;;;;;;");
    if (err) {
      res.status(StatusCode.Unauthorized).json({ message: err });
      console.log("err in login API Gateway");
    } else {
      res.cookie("instructorData", result.activationToken, {
        httpOnly: true,
      });
      console.log("------", result, "-----------");
      res.status(StatusCode.OK).json(result);
    }
  });
};

profile= (req: Request, res: Response, next: NextFunction) => {
  console.log("list course herererer")
  const instructorData = req.cookies.instructorData;
  console.log(instructorData,"insIddd")
  const decoded: any = jwt.verify(instructorData, process.env.JWT_SECRET || "");
  const instructorId = decoded.instructorId

  const updatedValues = {
    instructorId: decoded.instructorId,
  };

  console.log(updatedValues)
    InstructorClient.Profile(updatedValues, (err: Error, result: any) => {
  
    console.log("----------------- side",result,";;;;;;;;;;;;;;;;;;;;;;;;;;;");
    if (err) {
      res.status(StatusCode.Unauthorized).json({ message: err });
      console.log("err in login API Gateway");
    } else {
      
      console.log("------", result, "-----------");
      res.status(StatusCode.OK).json(result);
    }
  });
};

}