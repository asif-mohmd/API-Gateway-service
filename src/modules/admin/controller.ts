import { Request, Response, NextFunction } from "express";
import { AdminClient } from "./config/grpc-client/adminClient";
import { StatusCode } from "../../interfaces/enums";

export default class AdminController {


 login = (req: Request, res: Response, next: NextFunction) => {
  console.log("admioneeeeeeeeeeeeeeeee")
  AdminClient.Login(req.body.loginData, (err: Error, result: any) => {
    const adminData = req.cookies.userData;
    console.log(req.cookies)
    console.log("login side",adminData);
    if (err) {
      res.status(StatusCode.Unauthorized).json({ message: err });
      console.log("err in login API Gateway");
    } else {
      console.log("else caseee loginnnn");
      console.log("------", result, "-----------");
      res.status(StatusCode.OK).json(result)
    }
  });
};

}