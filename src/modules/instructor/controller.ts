import { Request, Response, NextFunction } from "express";
import { InstructorClient } from "./config/grpc-client/instructorClient";
import jwt from "jsonwebtoken"

export const register = (req: Request, res: Response, next: NextFunction) => {
  console.log("rehgiiiiiiiiiiiiiiii")
    InstructorClient.Register(req.body.formData, (err: Error, result: any) => {
    if (err) {
      res.status(401).json({ message: err });
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

export const otp = (req: Request, res: Response, next: NextFunction) => {
  const instructorData = req.cookies.instructorData;
  console.log(instructorData)
  const decoded: any = jwt.verify(instructorData.token, process.env.JWT_SECRET || "");
  if (req.body.otp === decoded.activationCode) {
    InstructorClient.ActivateInstructor(decoded.instructorData, (err: Error, result: any) => {
      if (err) {
        res.status(401).json({ message: err });
      } else {
        if (result.status) {
          res.status(200).json({ status: true });
        } else {
          res.status(401).json({ status: false });
        }
      }
    });
  } else {
    res.status(401).json({ status: false });
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.instructorLoginData,"------------------------------")
    InstructorClient.Login(req.body.instructorLoginData, (err: Error, result: any) => {
    const instructorData = req.cookies.instructorData;
    console.log(req.cookies)
    console.log("login side",instructorData);

    console.log("----------------- side",result,";;;;;;;;;;;;;;;;;;;;;;;;;;;");
    if (err) {
      res.status(401).json({ message: err });
      console.log("err in login API Gateway");
    } else {
      console.log("else caseee loginnnn");
      console.log("------", result, "-----------");
      res.status(201).json(result);
    }
  });
};
