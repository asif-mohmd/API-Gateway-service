import { Request, Response, NextFunction } from "express";
import { UserClient } from "./config/grpc-client/userClient";

export const register = (req: Request, res: Response, next: NextFunction) => {
  UserClient.Register(req.body.formData, (err: Error, result: any) => {
    console.log(result, "jkkghuighjksadfssfsfsfsfsfsfsfsfsfsfsfslssssBiu");
    let userData = req.body.formData;
    console.log(userData);
    if (err) {
      res.status(401).json({ message: err });
      console.log("err in API gateway");
    } else {
      console.log("----", result, "----------------");
      if (result.registerStatus) {
        console.log("woreking")
        res.cookie("userData", userData, {
          httpOnly: true,
        });
        return true;
      } else {
        console.log("errror");
        // Assuming successful registration, use appropriate status code (e.g., 200)
        res.status(201).json(result); // Include 'data' in the response
      }
    }
  });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  UserClient.Login(req.body.loginData, (err: Error, result: any) => {
    const userData = req.cookies.userData;
    console.log(req.cookies)
    console.log("login side",userData);
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
