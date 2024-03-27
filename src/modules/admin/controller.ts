import { Request, Response, NextFunction } from "express";
import { AdminClient } from "./config/grpc-client/adminClient";

export const login = (req: Request, res: Response, next: NextFunction) => {
  AdminClient.Login(req.body.loginData, (err: Error, result: any) => {
    const adminData = req.cookies.userData;
    console.log(req.cookies)
    console.log("login side",adminData);
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
